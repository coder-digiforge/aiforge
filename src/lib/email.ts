import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

const FROM = process.env.EMAIL_FROM || "noreply@aiforge.example.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function deliver(options: {
  email: string;
  subject: string;
  html: string;
  token: string;
  purpose: string;
}): Promise<{ success: boolean; error?: string }> {
  const client = getResend();
  if (!client) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[email] RESEND_API_KEY not set. ${options.purpose} token for ${options.email}: ${options.token}`,
      );
      return { success: false, error: "RESEND_API_KEY is not configured." };
    }
    return { success: false, error: "Email delivery is not configured." };
  }

  try {
    const { error } = await client.emails.send({
      from: FROM,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
    if (error) {
      console.error(`Failed to send ${options.purpose} email:`, error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error(`Failed to send ${options.purpose} email:`, error);
    return { success: false, error: String(error) };
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  return deliver({
    email,
    token,
    purpose: "verification",
    subject: "Verify your AIForge account",
    html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1a1a2e;">Welcome to AIForge</h1>
          <p>Thanks for signing up! Please verify your email address to get started.</p>
          <p><a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email</a></p>
          <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
        </div>
      `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  return deliver({
    email,
    token,
    purpose: "password reset",
    subject: "Reset your AIForge password",
    html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1a1a2e;">Password Reset Request</h1>
          <p>You requested to reset your password. Click the button below to create a new password.</p>
          <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a></p>
          <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  return deliver({
    email,
    token: "",
    purpose: "welcome",
    subject: "Welcome to AIForge!",
    html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1a1a2e;">Welcome to AIForge, ${name}!</h1>
          <p>Your account is now verified and ready to use. You have 120 free credits to explore all 7 AI generators.</p>
          <p><a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Open Dashboard</a></p>
        </div>
      `,
  });
}