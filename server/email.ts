import { Resend } from "resend";

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email
  };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: credentials.fromEmail || "hello@vonai.com"
  };
}

export const isEmailServiceAvailable = async (): Promise<boolean> => {
  try {
    await getCredentials();
    return true;
  } catch {
    return false;
  }
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
  let resendClient;
  let fromEmailDefault;
  
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    resendClient = client;
    fromEmailDefault = fromEmail;
  } catch (error) {
    throw new Error("Email service is not configured. Please set up the Resend connection.");
  }

  const fromEmail = newsletter.fromEmail || fromEmailDefault;
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
        await resendClient.emails.send({
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
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: `von AI <${fromEmail}>`,
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
            If you'd like to unsubscribe, <a href="${process.env.REPLIT_DEV_DOMAIN || "https://von-ai.com"}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #999;">click here</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.warn("Email service not available, skipping welcome email:", error);
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const resetUrl = `${process.env.REPLIT_DEV_DOMAIN || "https://von-ai.com"}/admin/reset-password?token=${resetToken}`;

    await client.emails.send({
      from: `von AI <${fromEmail}>`,
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

export async function sendContactAcknowledgementEmail(name: string, email: string): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();

    await client.emails.send({
      from: `von AI <${fromEmail}>`,
      to: email,
      subject: "Thank You for Contacting von AI",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; margin-bottom: 20px;">Thank You, ${name}!</h1>
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            We've received your message and appreciate you reaching out to von AI.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Our team will review your inquiry and get back to you within 24-48 hours. 
            We're excited to discuss how AI automation can transform your business.
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #333; font-weight: 600; margin-bottom: 10px;">In the meantime:</p>
            <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Explore our <a href="https://von-ai.com/blog" style="color: #f97316; text-decoration: none;">blog</a> for AI insights</li>
              <li>Check out our <a href="https://von-ai.com/solutions" style="color: #f97316; text-decoration: none;">solutions</a> page</li>
              <li>Learn about our <a href="https://von-ai.com/case-studies" style="color: #f97316; text-decoration: none;">case studies</a></li>
            </ul>
          </div>
          <p style="color: #666; line-height: 1.6;">
            If you have an urgent matter, feel free to reply to this email directly.
          </p>
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong>The von AI Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            von AI - Transforming Business Through AI Automation
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.warn("Failed to send contact acknowledgement email:", error);
  }
}

function generateNewsletterHTML(content: string, subscriberEmail: string): string {
  const unsubscribeUrl = `${process.env.REPLIT_DEV_DOMAIN || "https://von-ai.com"}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;
  
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
