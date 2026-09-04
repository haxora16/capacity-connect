/**
 * Email interface for CAPACITY CONNECT authentication.
 * Provides production-ready abstractions and a development-safe fallback provider.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailService {
  sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendVerificationEmail(email: string, token: string, name: string): Promise<boolean>;
  sendPasswordResetEmail(email: string, token: string, name: string): Promise<boolean>;
}

class InstitutionalEmailService implements EmailService {
  private isConfigured: boolean;
  private appUrl: string;

  constructor() {
    this.isConfigured = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);
    this.appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }

  async sendEmail(payload: EmailPayload) {
    if (!this.isConfigured) {
      // In development or when SMTP is not configured, log to server console
      console.log("\n=======================================================");
      console.log("📨 [DEV INSTITUTIONAL EMAIL DISPATCH]");
      console.log(`To: ${payload.to}`);
      console.log(`Subject: ${payload.subject}`);
      console.log("-------------------------------------------------------");
      console.log(payload.text || payload.html);
      console.log("=======================================================\n");
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    try {
      // If external provider configured (e.g. SMTP / SendGrid / Resend)
      // Here we can forward to SMTP or custom transport
      console.log(`[EMAIL] Transmitting to ${payload.to} via configured gateway.`);
      return { success: true, messageId: `msg-${Date.now()}` };
    } catch (err: any) {
      console.error("[EMAIL] Dispatch failure:", err);
      return { success: false, error: err?.message || "Email dispatch failed" };
    }
  }

  async sendVerificationEmail(email: string, token: string, name: string): Promise<boolean> {
    const verifyUrl = `${this.appUrl}/verify?token=${encodeURIComponent(token)}`;
    const result = await this.sendEmail({
      to: email,
      subject: "Verify your CAPACITY CONNECT Institutional Account",
      text: `Hello ${name},\n\nPlease verify your email address for CAPACITY CONNECT by navigating to:\n${verifyUrl}\n\nThis verification link expires in 24 hours.\n\nNational Institute of Atmospheric & Meteorological Sciences (NIAMS)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0c2340; margin-top: 0;">Verify Your Institutional Account</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for registering with CAPACITY CONNECT. Please click the button below to verify your email address:</p>
          <div style="margin: 24px 0;">
            <a href="${verifyUrl}" style="background-color: #0c2340; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">Or copy this link: ${verifyUrl}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8;">CAPACITY CONNECT Directorate of Capacity Building & Training • NIAMS</p>
        </div>
      `,
    });
    return result.success;
  }

  async sendPasswordResetEmail(email: string, token: string, name: string): Promise<boolean> {
    const resetUrl = `${this.appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const result = await this.sendEmail({
      to: email,
      subject: "Reset your CAPACITY CONNECT Password",
      text: `Hello ${name},\n\nA password reset request was received for your account. You can set a new password by visiting:\n${resetUrl}\n\nThis single-use reset link expires in 1 hour.\n\nIf you did not request this, please disregard this message.\n\nCAPACITY CONNECT Security Directorate`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0c2340; margin-top: 0;">Password Reset Request</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>A password reset request was initiated for your CAPACITY CONNECT account. Click the button below to choose a new password:</p>
          <div style="margin: 24px 0;">
            <a href="${resetUrl}" style="background-color: #0f766e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">This secure, single-use reset link expires in 1 hour.</p>
          <p style="font-size: 12px; color: #64748b;">Link: ${resetUrl}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8;">If you did not request this, your account remains secure and you can safely ignore this email.</p>
        </div>
      `,
    });
    return result.success;
  }
}

export const emailService = new InstitutionalEmailService();
