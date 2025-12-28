-- Add explicit UPDATE and DELETE policies for user_roles (admin only)
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add length constraints to waitlist_signups for input validation
ALTER TABLE public.waitlist_signups
ADD CONSTRAINT email_length_check CHECK (length(email) <= 255);

ALTER TABLE public.waitlist_signups
ADD CONSTRAINT referral_code_format_check CHECK (
  referral_code IS NULL OR referral_code ~ '^[a-f0-9]{12}$'
);

ALTER TABLE public.waitlist_signups
ADD CONSTRAINT referred_by_format_check CHECK (
  referred_by IS NULL OR referred_by ~ '^[a-f0-9]{12}$'
);