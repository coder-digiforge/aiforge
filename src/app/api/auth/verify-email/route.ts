import { NextRequest, NextResponse } from "next/server";
import { errorMessage } from "@/lib/errors";
import { verifyEmail } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!rateLimit(`verify:${clientKey(request)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = body.token;
  if (!token) {
    return NextResponse.json({ error: "Token is required." }, { status: 400 });
  }

  try {
    const user = await verifyEmail(token);
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: errorMessage(err, "Request failed.") }, { status: 400 });
  }
}