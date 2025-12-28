import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = Deno.env.get("ADMIN_EMAIL");
const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

interface SignupNotification {
  email: string;
  position: number;
  referredBy?: string;
  totalSignups: number;
}

// Input validation helpers
const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 255) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPosition = (pos: unknown): pos is number => {
  return typeof pos === 'number' && Number.isInteger(pos) && pos > 0 && pos < 10000000;
};

const isValidReferralCode = (code: unknown): boolean => {
  if (code === null || code === undefined) return true;
  if (typeof code !== 'string') return false;
  if (code.length === 0) return true;
  // Referral codes are 12 character hex strings
  return /^[a-f0-9]{12}$/i.test(code);
};

const sanitizeForHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate internal secret to prevent unauthorized calls
    const requestSecret = req.headers.get("x-internal-secret");
    if (!internalSecret || requestSecret !== internalSecret) {
      console.warn("Unauthorized attempt to call notify-admin-signup");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    const { email, position, referredBy, totalSignups } = body as SignupNotification;

    // Validate all inputs
    if (!isValidEmail(email)) {
      console.warn("Invalid email format in notification request");
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidPosition(position) || !isValidPosition(totalSignups)) {
      console.warn("Invalid position values in notification request");
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!isValidReferralCode(referredBy)) {
      console.warn("Invalid referral code format in notification request");
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending admin notification for new signup: ${email}`);

    // Sanitize values for HTML output
    const safeEmail = sanitizeForHtml(email);
    const safeReferredBy = referredBy ? sanitizeForHtml(referredBy) : null;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0f;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 16px 24px; border-radius: 12px; margin-bottom: 20px;">
                <span style="font-size: 28px;">🎉</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                New Waitlist Signup!
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Stats Cards -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48%" style="padding-right: 8px;">
                    <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="color: #a5b4fc; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Position</div>
                      <div style="color: #ffffff; font-size: 32px; font-weight: 700;">#${position}</div>
                    </div>
                  </td>
                  <td width="48%" style="padding-left: 8px;">
                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="color: #c4b5fd; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Total Signups</div>
                      <div style="color: #ffffff; font-size: 32px; font-weight: 700;">${totalSignups}</div>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Email Info -->
              <div style="margin-top: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px;">
                <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Email Address</div>
                <div style="color: #ffffff; font-size: 18px; font-weight: 600; word-break: break-all;">${safeEmail}</div>
              </div>
              
              ${safeReferredBy ? `
              <!-- Referral Info -->
              <div style="margin-top: 16px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 20px;">
                <div style="display: flex; align-items: center;">
                  <span style="font-size: 20px; margin-right: 12px;">🔗</span>
                  <div>
                    <div style="color: #86efac; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Referred By</div>
                    <div style="color: #ffffff; font-size: 14px; font-family: monospace;">${safeReferredBy}</div>
                  </div>
                </div>
              </div>
              ` : ''}
              
              <!-- Timestamp -->
              <div style="margin-top: 24px; text-align: center; color: #6b7280; font-size: 13px;">
                Signed up on ${new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="text-align: center;">
                    <div style="color: #6b7280; font-size: 12px;">
                      Y0 Waitlist Admin Notification
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Y0 Waitlist <onboarding@resend.dev>",
      to: [adminEmail!],
      subject: `🎉 New Signup #${position}: ${safeEmail}`,
      html: emailHtml,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    // Log full error details server-side only
    console.error("Error sending admin notification:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    
    // Return generic error to client - never expose internal details
    return new Response(
      JSON.stringify({ error: "Failed to process notification", code: "NOTIFICATION_ERROR" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
