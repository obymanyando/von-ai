import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const isEmailServiceAvailable = (): boolean => {
  return !!resend && !!process.env.RESEND_API_KEY;
};

export interface NewsletterEmail {
  subject: string;
  content: string;
  fromEmail?: string;
  fromName?: string;
}

export async function sendNewsletter(
  subscribers: string[],
  newsletter: NewsletterEmail,
  onBounce?: (email: string, error: string) => Promise<void>
): Promise<{ success: boolean; sent: number; failed: number; errors: string[]; bounced: string[] }> {
  if (!isEmailServiceAvailable() || !resend) {
    throw new Error("Email service is not configured. Please set RESEND_API_KEY environment variable.");
  }

  const fromEmail = newsletter.fromEmail || "hello@vonai.com";
  const fromName = newsletter.fromName || "von AI";
  const from = `${fromName} <${fromEmail}>`;

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  const bounced: string[] = [];

  // Send emails in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    const promises = batch.map(async (email) => {
      try {
        await resend.emails.send({
          from,
          to: email,
          subject: newsletter.subject,
          html: generateNewsletterHTML(newsletter.content, email),
        });
        sent++;
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push(`Failed to send to ${email}: ${errorMessage}`);
        
        // Check if it's a bounce (permanent failure)
        if (errorMessage.includes("bounce") || errorMessage.includes("invalid") || errorMessage.includes("not found")) {
          bounced.push(email);
          if (onBounce) {
            await onBounce(email, errorMessage);
          }
        }
      }
    });

    await Promise.all(promises);
    
    // Small delay between batches
    if (i + batchSize < subscribers.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { success: failed === 0, sent, failed, errors, bounced };
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  if (!isEmailServiceAvailable() || !resend) {
    console.warn("Email service not available, skipping welcome email");
    return;
  }

  try {
    await resend.emails.send({
      from: "von AI <hello@vonai.com>",
      to: email,
      subject: "Welcome to von AI Newsletter",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; margin-bottom: 20px;">Welcome to von AI!</h1>
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Thanks for subscribing to our newsletter. You'll receive the latest insights on AI automation,
            industry trends, and expert tips to help you transform your business.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            We're excited to have you in our community!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            If you'd like to unsubscribe, <a href="${process.env.REPLIT_DEV_DOMAIN || "https://yoursite.com"}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #999;">click here</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  if (!isEmailServiceAvailable() || !resend) {
    console.warn("Email service not available, skipping password reset email");
    return;
  }

  const resetUrl = `${process.env.REPLIT_DEV_DOMAIN || "https://von-ai.com"}/admin/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: "von AI <hello@vonai.com>",
      to: email,
      subject: "Reset Your Admin Password - von AI",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; margin-bottom: 20px;">Reset Your Password</h1>
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            You requested to reset your admin password. Click the button below to create a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #999; font-size: 14px; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">
            ${resetUrl}
          </p>
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            This is an automated message from von AI admin system.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}

function generateNewsletterHTML(content: string, subscriberEmail: string): string {
  const unsubscribeUrl = `${process.env.REPLIT_DEV_DOMAIN || "https://yoursite.com"}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;
  
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="margin-bottom: 30px;">
        <h1 style="color: #000; margin-bottom: 10px;">von AI</h1>
      </div>
      
      <div style="color: #333; line-height: 1.6;">
        ${content}
      </div>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px;" />
      
      <div style="color: #999; font-size: 12px; text-align: center;">
        <p style="margin-bottom: 10px;">
          You're receiving this email because you subscribed to von AI updates.
        </p>
        <p>
          <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;
}
