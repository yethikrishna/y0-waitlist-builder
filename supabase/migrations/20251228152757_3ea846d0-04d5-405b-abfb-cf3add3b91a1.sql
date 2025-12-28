-- Create waitlist_signups table
CREATE TABLE public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by TEXT,
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist_signups(email);
CREATE INDEX idx_waitlist_referral_code ON public.waitlist_signups(referral_code);
CREATE INDEX idx_waitlist_created_at ON public.waitlist_signups(created_at);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (signup) - no auth required for waitlist
CREATE POLICY "Anyone can signup to waitlist"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- Allow reading own signup by email (for duplicate check)
CREATE POLICY "Anyone can check if email exists"
ON public.waitlist_signups
FOR SELECT
USING (true);

-- Create function to auto-assign position
CREATE OR REPLACE FUNCTION public.set_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
  NEW.position := (SELECT COALESCE(MAX(position), 0) + 1 FROM public.waitlist_signups);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto position
CREATE TRIGGER set_position_on_insert
BEFORE INSERT ON public.waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION public.set_waitlist_position();

-- Function to get total waitlist count
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.waitlist_signups;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;