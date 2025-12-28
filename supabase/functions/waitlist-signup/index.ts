import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation helpers
const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 255) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidReferralCode = (code: unknown): boolean => {
  if (code === null || code === undefined || code === '') return true;
  if (typeof code !== 'string') return false;
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

interface SignupRequest {
  email: string;
  referredBy?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SignupRequest = await req.json();
    const email = body.email?.toLowerCase().trim();
    const referredBy = body.referredBy?.trim() || null;

    // Validate email
    if (!isValidEmail(email)) {
      console.warn('Invalid email format:', email);
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate referral code format
    if (!isValidReferralCode(referredBy)) {
      console.warn('Invalid referral code format:', referredBy);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid referral code format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from('waitlist_signups')
      .select('id, position, referral_code, referral_count')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking email:', checkError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to process signup. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existing) {
      const spotsGained = (existing.referral_count || 0) * 5;
      return new Response(
        JSON.stringify({
          success: true,
          position: existing.position,
          referralCode: existing.referral_code,
          referralCount: existing.referral_count || 0,
          spotsGained,
          alreadyExists: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify referral code exists if provided
    let validReferredBy = null;
    if (referredBy) {
      const { data: referrer } = await supabase
        .from('waitlist_signups')
        .select('id')
        .eq('referral_code', referredBy)
        .maybeSingle();
      
      if (referrer) {
        validReferredBy = referredBy;
      } else {
        console.warn('Referral code not found:', referredBy);
      }
    }

    // Insert new signup
    const { data: signup, error: insertError } = await supabase
      .from('waitlist_signups')
      .insert([{
        email,
        referred_by: validReferredBy,
        metadata: {}
      }])
      .select('position, referral_code')
      .single();

    if (insertError) {
      console.error('Waitlist signup error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to join waitlist. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`New signup: ${email} at position ${signup.position}`);

    // Send admin notification (fire and forget)
    sendAdminNotification(email, signup.position, validReferredBy);

    return new Response(
      JSON.stringify({
        success: true,
        position: signup.position,
        referralCode: signup.referral_code,
        referralCount: 0,
        spotsGained: 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in waitlist-signup:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendAdminNotification(email: string, position: number, referredBy: string | null) {
  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    
    if (!resendKey || !adminEmail) {
      console.warn('Admin notification not configured');
      return;
    }

    const resend = new Resend(resendKey);
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
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 16px 24px; border-radius: 12px; margin-bottom: 20px;">
                <span style="font-size: 28px;">🎉</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">New Waitlist Signup!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
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
                      <div style="color: #ffffff; font-size: 32px; font-weight: 700;">${position}</div>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px;">
                <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Email Address</div>
                <div style="color: #ffffff; font-size: 18px; font-weight: 600; word-break: break-all;">${safeEmail}</div>
              </div>
              ${safeReferredBy ? `
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
              <div style="margin-top: 24px; text-align: center; color: #6b7280; font-size: 13px;">
                Signed up on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05);">
              <div style="text-align: center; color: #6b7280; font-size: 12px;">Y0 Waitlist Admin Notification</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: "Y0 Waitlist <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🎉 New Signup #${position}: ${safeEmail}`,
      html: emailHtml,
    });

    console.log('Admin notification sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}
