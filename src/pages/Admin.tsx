import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Search, Download, Users, TrendingUp, Calendar, 
  ArrowUpDown, ChevronLeft, ChevronRight, Mail, Eye, EyeOff,
  Share2, Award, Percent, Trophy, LogOut, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getWaitlistSignups, exportToCSV, calculateReferralStats, checkIsAdmin, WaitlistSignupRow, ReferralStats } from "@/lib/admin";
import { Y0LogoMark } from "@/components/ui/y0-logo";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type SortField = "position" | "email" | "created_at";
type SortOrder = "asc" | "desc";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [signups, setSignups] = useState<WaitlistSignupRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("position");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const itemsPerPage = 20;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        // Check admin role when user changes
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus();
          }, 0);
        } else {
          setIsAdmin(false);
          setIsCheckingAuth(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus();
      } else {
        setIsCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async () => {
    setIsCheckingAuth(true);
    const adminStatus = await checkIsAdmin();
    setIsAdmin(adminStatus);
    setIsCheckingAuth(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSignups();
    }
  }, [isAdmin]);

  const fetchSignups = async () => {
    setIsLoading(true);
    const data = await getWaitlistSignups();
    setSignups(data);
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error("Failed to sign in");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setSignups([]);
    toast.success("Logged out successfully");
  };

  // Filter and sort signups
  const filteredSignups = useMemo(() => {
    let result = [...signups];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        signup =>
          signup.email.toLowerCase().includes(query) ||
          signup.referral_code?.toLowerCase().includes(query) ||
          signup.referred_by?.toLowerCase().includes(query)
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      result = result.filter(signup => {
        if (!signup.created_at) return false;
        return new Date(signup.created_at) >= filterDate;
      });
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number | null = null;
      let bVal: string | number | null = null;

      switch (sortField) {
        case "position":
          aVal = a.position || 0;
          bVal = b.position || 0;
          break;
        case "email":
          aVal = a.email;
          bVal = b.email;
          break;
        case "created_at":
          aVal = a.created_at || "";
          bVal = b.created_at || "";
          break;
      }

      if (aVal === null || bVal === null) return 0;
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return sortOrder === "asc" 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [signups, searchQuery, sortField, sortOrder, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSignups.length / itemsPerPage);
  const paginatedSignups = filteredSignups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExport = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    exportToCSV(filteredSignups, `waitlist-signups-${dateStr}.csv`);
    toast.success(`Exported ${filteredSignups.length} signups to CSV`);
  };

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date();
    thisWeek.setDate(today.getDate() - 7);

    const todaySignups = signups.filter(s => 
      s.created_at && new Date(s.created_at) >= today
    ).length;

    const weekSignups = signups.filter(s => 
      s.created_at && new Date(s.created_at) >= thisWeek
    ).length;

    const referredSignups = signups.filter(s => s.referred_by).length;

    return { total: signups.length, today: todaySignups, week: weekSignups, referred: referredSignups };
  }, [signups]);

  // Referral analytics
  const referralStats = useMemo(() => calculateReferralStats(signups), [signups]);

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Login screen - user not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Card className="p-8">
            <div className="text-center mb-6">
              <Y0LogoMark size={48} className="mx-auto mb-4 text-primary" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in with your admin account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Access denied - user logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Card className="p-8 text-center">
            <Y0LogoMark size={48} className="mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-sm text-muted-foreground mb-6">
              You don't have admin permissions. Please contact an administrator.
            </p>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Y0LogoMark size={32} className="text-primary" />
            <div>
              <h1 className="text-xl font-bold">Waitlist Admin</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Signups</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.week}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.referred}</p>
                <p className="text-sm text-muted-foreground">Referred</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Referral Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Stats Cards */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Referral Analytics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Total Referrals
                </div>
                <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Percent className="w-4 h-4" />
                  Conversion Rate
                </div>
                <p className="text-2xl font-bold">{referralStats.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Users className="w-4 h-4" />
                  Referred Signups
                </div>
                <p className="text-2xl font-bold">{referralStats.referredSignups}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Award className="w-4 h-4" />
                  Avg per Referrer
                </div>
                <p className="text-2xl font-bold">{referralStats.avgReferralsPerUser.toFixed(1)}</p>
              </div>
            </div>
          </Card>

          {/* Top Referrers Leaderboard */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Referrers
            </h3>
            {referralStats.topReferrers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No referrals yet</p>
            ) : (
              <div className="space-y-3">
                {referralStats.topReferrers.slice(0, 5).map((referrer, index) => (
                  <div 
                    key={referrer.referral_code} 
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                      index === 1 ? 'bg-gray-400/20 text-gray-600' :
                      index === 2 ? 'bg-amber-600/20 text-amber-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{referrer.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Position #{referrer.position}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{referrer.referral_count}</p>
                      <p className="text-xs text-muted-foreground">referrals</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, referral code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={dateFilter} onValueChange={(value) => {
              setDateFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("position")}
                  >
                    <div className="flex items-center gap-1">
                      #
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Referred By</TableHead>
                  <TableHead className="text-center">Referrals</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-1">
                      Signed Up
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedSignups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No signups found matching your search" : "No signups yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSignups.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">
                        {signup.position}
                      </TableCell>
                      <TableCell>{signup.email}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {signup.referral_code || '-'}
                        </code>
                      </TableCell>
                      <TableCell>
                        {signup.referred_by ? (
                          <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {signup.referred_by}
                          </code>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-medium ${(signup.referral_count || 0) > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {signup.referral_count || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {signup.created_at 
                          ? new Date(signup.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-border px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSignups.length)} of {filteredSignups.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Admin;