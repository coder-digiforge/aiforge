import { NextRequest, NextResponse } from "next/server";
import { errorMessage } from "@/lib/errors";
import { resetPassword } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!rateLimit(`pwreset-token:${clientKey(request)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = body.token;
  const password = body.password ?? "";
  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
  }

  try {
    await resetPassword(token, password);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err, "Request failed.") }, { status: 400 });
  }
}