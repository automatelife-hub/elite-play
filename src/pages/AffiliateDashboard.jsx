import React, { useState, useEffect, useCallback } from "react";
import { supabase, db } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  DollarSign,
  MousePointer,
  Users,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const RANGE_OPTIONS = [
  { value: "7d",  label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "mtd", label: "Month to Date" },
  { value: "all", label: "All Time" },
];

const DEAL_TYPE_COLORS = {
  revenue_share: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
  cpa:           "bg-green-500/20 text-green-300 border-green-400/30",
  hybrid:        "bg-purple-500/20 text-purple-300 border-purple-400/30",
  rakeback:      "bg-orange-500/20 text-orange-300 border-orange-400/30",
  flat:          "bg-slate-500/20 text-slate-300 border-slate-400/30",
};

function StatCard({ title, value, subtext, icon: Icon, color = "cyan", loading }) {
  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 bg-slate-700" />
            ) : (
              <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
            )}
            {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
          </div>
          <div className={`p-2 rounded-lg bg-${color}-500/10`}>
            <Icon className={`w-5 h-5 text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AffiliateDashboard() {
  const [user, setUser]           = useState(null);
  const [range, setRange]         = useState("30d");
  const [summary, setSummary]     = useState([]);
  const [recentClicks, setRecentClicks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Aggregate totals
  const totals = summary.reduce(
    (acc, row) => ({
      clicks:      acc.clicks      + Number(row.valid_clicks   || 0),
      registrations: acc.registrations + Number(row.registrations || 0),
      deposits:    acc.deposits    + Number(row.first_deposits  || 0),
      commission:  acc.commission  + Number(row.total_commission || 0),
      unreconciled: acc.unreconciled + Number(row.unreconciled_count || 0),
    }),
    { clicks: 0, registrations: 0, deposits: 0, commission: 0, unreconciled: 0 }
  );

  const loadData = useCallback(async () => {
    try {
      const [{ data: summaryData, error: summaryErr }, { data: clicks, error: clickErr }] =
        await Promise.all([
          supabase.rpc('get_operator_commission_summary', { p_range: range }),
          supabase
            .from('affiliate_click_events')
            .select('id, sub_id, operator_slug, traffic_source, is_bot, is_duplicate, clicked_at, country_code')
            .order('clicked_at', { ascending: false })
            .limit(20),
        ]);

      if (summaryErr) throw summaryErr;
      if (clickErr) throw clickErr;

      setSummary(summaryData || []);
      setRecentClicks(clicks || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
      // If RPC doesn't exist yet, load operator_deals as fallback
      const { data: deals } = await supabase.from('operator_deals').select('*').eq('is_active', true).order('operator_name');
      if (deals) {
        setSummary(deals.map(d => ({
          operator_slug:      d.operator_slug,
          operator_name:      d.operator_name,
          deal_type:          d.deal_type,
          total_clicks:       0,
          valid_clicks:       0,
          registrations:      0,
          first_deposits:     0,
          total_deposits:     0,
          total_commission:   0,
          unreconciled_count: 0,
          last_conversion_at: null,
        })));
      }
    }
  }, [range]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const currentUser = await db.auth.me();
      setUser(currentUser);
      if (!currentUser || currentUser.role !== 'admin') {
        toast.error("Admin access required");
        setLoading(false);
        return;
      }
      await loadData();
      setLoading(false);
    };
    init();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!loading && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-slate-400">Admin privileges required to view this dashboard.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-cyan-400" />
                Affiliate Commission Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Real-time earnings and conversion tracking across all operators
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-44 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {RANGE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value} className="text-white hover:bg-slate-700">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Valid Clicks"       value={totals.clicks.toLocaleString()}         icon={MousePointer} color="cyan"   loading={loading} />
          <StatCard title="Registrations"      value={totals.registrations.toLocaleString()}  icon={Users}        color="purple" loading={loading} />
          <StatCard title="First Deposits"     value={totals.deposits.toLocaleString()}       icon={TrendingUp}   color="green"  loading={loading} />
          <StatCard title="Total Commission"   value={formatCurrency(totals.commission)}       icon={DollarSign}   color="yellow" loading={loading} />
          <StatCard
            title="Unreconciled"
            value={totals.unreconciled.toLocaleString()}
            icon={AlertTriangle}
            color={totals.unreconciled > 0 ? "orange" : "slate"}
            subtext={totals.unreconciled > 0 ? "Needs review" : "All clear"}
            loading={loading}
          />
        </div>

        {/* Operator breakdown table */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Operator Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Operator</TableHead>
                    <TableHead className="text-slate-400">Deal Type</TableHead>
                    <TableHead className="text-slate-400 text-right">Valid Clicks</TableHead>
                    <TableHead className="text-slate-400 text-right">Registrations</TableHead>
                    <TableHead className="text-slate-400 text-right">1st Deposits</TableHead>
                    <TableHead className="text-slate-400 text-right">Commission</TableHead>
                    <TableHead className="text-slate-400 text-center">Reconciled</TableHead>
                    <TableHead className="text-slate-400">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-slate-700">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-16 bg-slate-700" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : summary.length === 0 ? (
                    <TableRow className="border-slate-700">
                      <TableCell colSpan={8} className="text-center text-slate-500 py-12">
                        No operator data available for this range.
                      </TableCell>
                    </TableRow>
                  ) : (
                    summary.map((row) => (
                      <TableRow key={row.operator_slug} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-medium text-white">
                          {row.operator_name}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${DEAL_TYPE_COLORS[row.deal_type] || 'bg-slate-600 text-slate-300'}`}>
                            {row.deal_type?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {Number(row.valid_clicks || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {Number(row.registrations || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {Number(row.first_deposits || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-400">
                          {formatCurrency(row.total_commission)}
                        </TableCell>
                        <TableCell className="text-center">
                          {Number(row.unreconciled_count || 0) === 0 ? (
                            <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                          ) : (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-xs">
                              {row.unreconciled_count} pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {row.last_conversion_at ? formatTime(row.last_conversion_at) : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent clicks feed */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Recent Clicks (Live Feed)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Sub ID</TableHead>
                    <TableHead className="text-slate-400">Operator</TableHead>
                    <TableHead className="text-slate-400">Source</TableHead>
                    <TableHead className="text-slate-400">Country</TableHead>
                    <TableHead className="text-slate-400 text-center">Status</TableHead>
                    <TableHead className="text-slate-400">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-slate-700">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-16 bg-slate-700" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : recentClicks.length === 0 ? (
                    <TableRow className="border-slate-700">
                      <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                        No recent clicks. Clicks appear here in real time once tracking is live.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentClicks.map((click) => (
                      <TableRow key={click.id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-mono text-xs text-slate-300">{click.sub_id}</TableCell>
                        <TableCell className="text-slate-300 capitalize">{click.operator_slug}</TableCell>
                        <TableCell>
                          <Badge className="bg-slate-700/60 text-slate-300 border-slate-600 text-xs">
                            {click.traffic_source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{click.country_code || '—'}</TableCell>
                        <TableCell className="text-center">
                          {click.is_bot ? (
                            <Badge className="bg-red-500/20 text-red-300 border-red-400/30 text-xs">bot</Badge>
                          ) : click.is_duplicate ? (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">dup</Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">valid</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {new Date(click.clicked_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
