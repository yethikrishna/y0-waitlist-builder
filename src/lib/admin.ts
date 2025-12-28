import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface WaitlistSignupRow {
  id: string;
  email: string;
  referral_code: string | null;
  referred_by: string | null;
  position: number | null;
  created_at: string | null;
  metadata: Json | null;
}

export async function getWaitlistSignups(): Promise<WaitlistSignupRow[]> {
  const { data, error } = await supabase
    .from('waitlist_signups')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching waitlist signups:', error);
    return [];
  }

  return data || [];
}

export function exportToCSV(signups: WaitlistSignupRow[], filename: string = 'waitlist-signups.csv'): void {
  const headers = ['Position', 'Email', 'Referral Code', 'Referred By', 'Signed Up'];
  
  const rows = signups.map(signup => [
    signup.position?.toString() || '',
    signup.email,
    signup.referral_code || '',
    signup.referred_by || '',
    signup.created_at ? new Date(signup.created_at).toLocaleString() : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
