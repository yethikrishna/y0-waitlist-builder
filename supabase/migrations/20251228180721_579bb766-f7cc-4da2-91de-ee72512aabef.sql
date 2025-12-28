-- Drop existing SELECT policies on waitlist_signups to start fresh
DROP POLICY IF EXISTS "Admins can view all signups" ON public.waitlist_signups;

-- Create a proper SELECT policy that only allows admins
CREATE POLICY "Only admins can view signups"
ON public.waitlist_signups
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));