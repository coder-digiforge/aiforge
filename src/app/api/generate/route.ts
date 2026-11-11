import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { generateContent, isLiveAiEnabled } from "@/lib/ai";
import { getGenerator } from "@/config/generators";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { mutateDb } from "@/lib/store";
import type { HistoryItem } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!rateLimit(`generate:${clientKey(request)}`, 12, 60_000)) {
    return NextResponse.json(
      { error: "Rate limit reached. Wait a moment and try again." },
      { status: 429 },
    );
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to generate content." }, { status: 401 });
  }

  let body: { generatorId?: string; prompt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const generatorId = body.generatorId?.trim() ?? "";
  const prompt = body.prompt?.trim() ?? "";

  const generator = getGenerator(generatorId);
  if (!generator) {
    return NextResponse.json({ error: "Unknown generator." }, { status: 404 });
  }

  if (prompt.length < 3) {
    return NextResponse.json(
      { error: "Prompt must be at least 3 characters." },
      { status: 400 },
    );
  }
  if (prompt.length > 8000) {
    return NextResponse.json({ error: "Prompt is too long (max 8000 chars)." }, { status: 400 });
  }

  const balance = await mutateDb((db) => db.users.find((u) => u.id === user.id)?.credits ?? 0);
  if (balance < generator.cost) {
    return NextResponse.json(
      { error: `Not enough credits. This tool costs ${generator.cost}.` },
      { status: 402 },
    );
  }

  let output: string;
  let demo: boolean;
  try {
    const result = await generateContent(generatorId, prompt);
    output = result.output;
    demo = result.demo;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed." },
      { status: 502 },
    );
  }

  const historyItem: HistoryItem = {
    id: crypto.randomUUID(),
    userId: user.id,
    generatorId,
    prompt,
    output,
    cost: generator.cost,
    demo,
    createdAt: new Date().toISOString(),
  };

  const outcome = await mutateDb((db) => {
    const dbUser = db.users.find((u) => u.id === user.id);
    if (!dbUser) return { ok: false as const, credits: 0 };
    if (dbUser.credits < generator.cost) {
      return { ok: false as const, credits: dbUser.credits };
    }
    dbUser.credits -= generator.cost;
    db.history.unshift(historyItem);
    if (db.history.length > 500) db.history.length = 500;
    return { ok: true as const, credits: dbUser.credits };
  });

  if (!outcome.ok) {
    return NextResponse.json(
      { error: "Not enough credits. Generation was not saved." },
      { status: 402 },
    );
  }

  return NextResponse.json({
    id: historyItem.id,
    output,
    demo,
    cost: generator.cost,
    credits: outcome.credits,
    liveAi: isLiveAiEnabled(),
  });
}
