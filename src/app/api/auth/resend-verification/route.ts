import { NextRequest, NextResponse } from "next/server";
import { resendVerification } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const OK_RESPONSE = {
  ok: true,
  message: "If an account exists for that email, a verification link has been sent.",
};

export async function POST(request: NextRequest) {
  if (!rateLimit(`resend:${clientKey(request)}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    await resendVerification(email);
  } catch {
    // Do not reveal whether the account exists.
  }
  return NextResponse.json(OK_RESPONSE);
}
