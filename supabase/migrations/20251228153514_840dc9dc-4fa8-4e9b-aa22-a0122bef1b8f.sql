-- Add referral_count column to track successful referrals
ALTER TABLE public.waitlist_signups 
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Create function to update referral count when someone signs up with a referral code
CREATE OR REPLACE FUNCTION public.update_referral_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- If the new signup has a referred_by code, increment the referrer's count
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by != '' THEN
    UPDATE public.waitlist_signups
    SET referral_count = referral_count + 1
    WHERE referral_code = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to call the function after insert
DROP TRIGGER IF EXISTS on_waitlist_signup_referral ON public.waitlist_signups;
CREATE TRIGGER on_waitlist_signup_referral
  AFTER INSERT ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_referral_count();

-- Create function to get priority position (higher referrals = better priority)
CREATE OR REPLACE FUNCTION public.get_priority_position(user_email TEXT)
RETURNS TABLE(
  original_position INTEGER,
  priority_position INTEGER,
  referral_count INTEGER,
  spots_gained INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH user_data AS (
    SELECT 
      position,
      waitlist_signups.referral_count
    FROM public.waitlist_signups
    WHERE email = LOWER(TRIM(user_email))
  ),
  ahead_count AS (
    SELECT COUNT(*)::INTEGER as users_ahead
    FROM public.waitlist_signups ws, user_data ud
    WHERE ws.position < ud.position
      OR (ws.referral_count > ud.referral_count AND ws.position > ud.position)
  )
  SELECT 
    ud.position as original_position,
    GREATEST(1, ud.position - (ud.referral_count * 5))::INTEGER as priority_position,
    ud.referral_count,
    (ud.referral_count * 5)::INTEGER as spots_gained
  FROM user_data ud;
$$;