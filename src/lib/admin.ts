import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface WaitlistSignupRow {
  id: string;
  email: string;
  referral_code: string | null;
  referred_by: string | null;
  referral_count: number | null;
  position: number | null;
  created_at: string | null;
  metadata: Json | null;
}

export interface TopReferrer {
  email: string;
  referral_code: string;
  referral_count: number;
  position: number | null;
}

export interface ReferralStats {
  totalReferrals: number;
  referredSignups: number;
  conversionRate: number;
  topReferrers: TopReferrer[];
  avgReferralsPerUser: number;
}

export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('admin-check-role');
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data?.isAdmin === true;
  } catch (err) {
    console.error('Exception checking admin status:', err);
    return false;
  }
}

export async function getWaitlistSignups(): Promise<WaitlistSignupRow[]> {
  try {
    const { data, error } = await supabase.functions.invoke('admin-get-signups');
    
    if (error) {
      console.error('Error fetching waitlist signups:', error);
      return [];
    }
    
    return data?.signups || [];
  } catch (err) {
    console.error('Exception fetching waitlist signups:', err);
    return [];
  }
}

export function exportToCSV(signups: WaitlistSignupRow[], filename: string = 'waitlist-signups.csv'): void {
  const headers = ['Position', 'Email', 'Referral Code', 'Referred By', 'Referral Count', 'Signed Up'];
  
  const rows = signups.map(signup => [
    signup.position?.toString() || '',
    signup.email,
    signup.referral_code || '',
    signup.referred_by || '',
    signup.referral_count?.toString() || '0',
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

export function calculateReferralStats(signups: WaitlistSignupRow[]): ReferralStats {
  const totalSignups = signups.length;
  const referredSignups = signups.filter(s => s.referred_by).length;
  const totalReferrals = signups.reduce((acc, s) => acc + (s.referral_count || 0), 0);
  
  // Users who have made at least one referral
  const usersWithReferrals = signups.filter(s => (s.referral_count || 0) > 0);
  const avgReferralsPerUser = usersWithReferrals.length > 0 
    ? totalReferrals / usersWithReferrals.length 
    : 0;
  
  // Conversion rate: referred signups / total signups
  const conversionRate = totalSignups > 0 
    ? (referredSignups / totalSignups) * 100 
    : 0;
  
  // Get top 10 referrers
  const topReferrers: TopReferrer[] = signups
    .filter(s => (s.referral_count || 0) > 0 && s.referral_code)
    .sort((a, b) => (b.referral_count || 0) - (a.referral_count || 0))
    .slice(0, 10)
    .map(s => ({
      email: s.email,
      referral_code: s.referral_code!,
      referral_count: s.referral_count || 0,
      position: s.position
    }));
  
  return {
    totalReferrals,
    referredSignups,
    conversionRate,
    topReferrers,
    avgReferralsPerUser
  };
}