/**
 * AffiliateReconciliation.jsx — Monthly reconciliation admin page (DAR-20)
 *
 * Allows admins to:
 *  - View unreconciled conversions by operator
 *  - Import operator commission reports (CSV paste or manual entry)
 *  - Mark conversions as reconciled and flag discrepancies
 *  - See a monthly summary with discrepancy counts
 */

import React, { useState, useEffect, useCallback } from "react";
import { supabase, db } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  AlertTriangle,
  Upload,
  RefreshCw,
  XCircle,
  Eye,
  FileText,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

const CONVERSION_TYPES = {
  registration:  { label: "Registration",   color: "bg-blue-500/20 text-blue-300 border-blue-400/30"    },
  first_deposit: { label: "First Deposit",  color: "bg-green-500/20 text-green-300 border-green-400/30" },
  deposit:       { label: "Deposit",        color: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"    },
  player_activity: { label: "Activity",    color: "bg-purple-500/20 text-purple-300 border-purple-400/30" },
};

function StatCard({ title, value, icon: Icon, color = "cyan" }) {
  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">{title}</p>
            <p className={`text-xl font-bold text-${color}-400`}>{value}</p>
          </div>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AffiliateReconciliation() {
  const [user, setUser]                 = useState(null);
  const [conversions, setConversions]   = useState([]);
  const [operators, setOperators]       = useState([]);
  const [filterOp, setFilterOp]         = useState("all");
  const [filterStatus, setFilterStatus] = useState("unreconciled");
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  // Import dialog
  const [showImport, setShowImport]     = useState(false);
  const [importText, setImportText]     = useState("");
  const [importOperator, setImportOperator] = useState("");
  const [importing, setImporting]       = useState(false);

  // Manual reconcile dialog
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualConv, setManualConv]     = useState(null);
  const [manualAmount, setManualAmount] = useState("");
  const [manualDate, setManualDate]     = useState("");
  const [submitting, setSubmitting]     = useState(false);

  const loadData = useCallback(async () => {
    try {
      let query = supabase
        .from('affiliate_conversions')
        .select('*, operator_deals:operator_deal_id (operator_name, deal_type)')
        .order('converted_at', { ascending: false })
        .limit(200);

      if (filterOp !== "all") query = query.eq('operator_slug', filterOp);
      if (filterStatus === "unreconciled") query = query.eq('is_reconciled', false);
      if (filterStatus === "reconciled")   query = query.eq('is_reconciled', true);
      if (filterStatus === "discrepancy")  query = query.not('discrepancy_amount', 'is', null).neq('discrepancy_amount', 0);

      const [{ data: convData, error: convErr }, { data: opData }] = await Promise.all([
        query,
        supabase.from('operator_deals').select('operator_slug, operator_name').eq('is_active', true).order('operator_name'),
      ]);

      if (convErr) throw convErr;
      setConversions(convData || []);
      setOperators(opData || []);
    } catch (err) {
      console.error("Reconciliation load error:", err);
      toast.error("Failed to load reconciliation data");
    }
  }, [filterOp, filterStatus]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const currentUser = await db.auth.me();
      setUser(currentUser);
      if (!currentUser || currentUser.role !== 'admin') {
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
  };

  // --- Manual single reconcile ---
  const openManual = (conv) => {
    setManualConv(conv);
    setManualAmount(conv.commission_amount?.toString() || "");
    setManualDate(conv.operator_report_date || new Date().toISOString().split('T')[0]);
    setShowManualDialog(true);
  };

  const submitManual = async () => {
    if (!manualConv || !manualAmount) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('reconcile_conversion', {
        p_conversion_id:          manualConv.id,
        p_operator_report_amount: parseFloat(manualAmount),
        p_operator_report_date:   manualDate || null,
      });
      if (error) throw error;
      toast.success(`Reconciled. Discrepancy: $${data.discrepancy?.toFixed(2) || '0.00'}`);
      setShowManualDialog(false);
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error("Reconcile failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- CSV bulk import ---
  // Expected CSV format: conversion_id,reported_amount,report_date
  const submitImport = async () => {
    if (!importText.trim()) return;
    setImporting(true);
    try {
      const lines = importText.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
      const rows = [];

      for (const line of lines) {
        const parts = line.split(',').map(s => s.trim());
        if (parts.length < 2) continue;
        rows.push({
          conversion_id:   parts[0],
          reported_amount: parseFloat(parts[1]),
          report_date:     parts[2] || null,
        });
      }

      if (rows.length === 0) {
        toast.error("No valid rows found in import");
        setImporting(false);
        return;
      }

      const { data, error } = await supabase.rpc('bulk_reconcile_from_report', { p_rows: rows });
      if (error) throw error;

      toast.success(
        `Import complete: ${data.matched} matched, ${data.discrepancy} discrepancies, ${data.not_found} not found`
      );
      setShowImport(false);
      setImportText("");
      await loadData();
    } catch (err) {
      console.error(err);
      toast.error("Import failed: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  // --- Stats ---
  const stats = {
    total:        conversions.length,
    unreconciled: conversions.filter(c => !c.is_reconciled).length,
    discrepancies: conversions.filter(c => c.discrepancy_amount && c.discrepancy_amount !== 0).length,
    totalCommission: conversions.reduce((s, c) => s + (Number(c.commission_amount) || 0), 0),
  };

  const fmtCurrency = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  if (!loading && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-slate-400">Admin privileges required.</p>
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
                <FileText className="w-7 h-7 text-purple-400" />
                Monthly Reconciliation
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Match operator commission reports against tracked conversions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImport(true)}
                className="border-purple-600 text-purple-300 hover:bg-purple-900/30"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Report
              </Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Conversions"     value={stats.total.toLocaleString()}       icon={Eye}            color="cyan"   />
          <StatCard title="Unreconciled"           value={stats.unreconciled.toLocaleString()} icon={AlertTriangle}  color="orange" />
          <StatCard title="Discrepancies Found"   value={stats.discrepancies.toLocaleString()} icon={XCircle}       color="red"    />
          <StatCard title="Total Commission"       value={fmtCurrency(stats.totalCommission)} icon={DollarSign}     color="green"  />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all"           className="text-white hover:bg-slate-700">All Conversions</SelectItem>
              <SelectItem value="unreconciled"  className="text-white hover:bg-slate-700">Unreconciled</SelectItem>
              <SelectItem value="reconciled"    className="text-white hover:bg-slate-700">Reconciled</SelectItem>
              <SelectItem value="discrepancy"   className="text-white hover:bg-slate-700">With Discrepancies</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterOp} onValueChange={setFilterOp}>
            <SelectTrigger className="w-44 bg-slate-800 border-slate-600 text-white">
              <SelectValue placeholder="All Operators" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-white hover:bg-slate-700">All Operators</SelectItem>
              {operators.map(op => (
                <SelectItem key={op.operator_slug} value={op.operator_slug} className="text-white hover:bg-slate-700">
                  {op.operator_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conversions table */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Operator</TableHead>
                    <TableHead className="text-slate-400">Type</TableHead>
                    <TableHead className="text-slate-400">Sub ID</TableHead>
                    <TableHead className="text-slate-400">Player</TableHead>
                    <TableHead className="text-slate-400 text-right">Our Amount</TableHead>
                    <TableHead className="text-slate-400 text-right">Discrepancy</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Converted</TableHead>
                    <TableHead className="text-slate-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="border-slate-700">
                        {Array.from({ length: 9 }).map((_, j) => (
                          <TableCell key={j}><div className="h-4 bg-slate-700 rounded animate-pulse w-16" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : conversions.length === 0 ? (
                    <TableRow className="border-slate-700">
                      <TableCell colSpan={9} className="text-center text-slate-500 py-12">
                        {filterStatus === "unreconciled"
                          ? "All conversions are reconciled for this period."
                          : "No conversions found with current filters."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    conversions.map((conv) => {
                      const typeInfo = CONVERSION_TYPES[conv.conversion_type] || { label: conv.conversion_type, color: "bg-slate-600 text-slate-300" };
                      const hasDisc = conv.discrepancy_amount && Math.abs(Number(conv.discrepancy_amount)) > 0.01;

                      return (
                        <TableRow key={conv.id} className="border-slate-700 hover:bg-slate-700/30">
                          <TableCell className="font-medium text-white capitalize">{conv.operator_slug}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${typeInfo.color}`}>{typeInfo.label}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-300">{conv.sub_id}</TableCell>
                          <TableCell className="text-slate-300 text-sm">{conv.player_username || conv.player_id || '—'}</TableCell>
                          <TableCell className="text-right text-green-400 font-medium">
                            {fmtCurrency(conv.commission_amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {conv.is_reconciled && hasDisc ? (
                              <span className="text-red-400 font-medium">{fmtCurrency(conv.discrepancy_amount)}</span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {conv.is_reconciled ? (
                              hasDisc ? (
                                <Badge className="bg-red-500/20 text-red-300 border-red-400/30 text-xs">Discrepancy</Badge>
                              ) : (
                                <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1 inline" />Matched
                                </Badge>
                              )
                            ) : (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-xs">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">{fmtDate(conv.converted_at)}</TableCell>
                          <TableCell>
                            {!conv.is_reconciled && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openManual(conv)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs px-2 py-1 h-auto"
                              >
                                Reconcile
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual reconcile dialog */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Reconcile Conversion</DialogTitle>
          </DialogHeader>
          {manualConv && (
            <div className="space-y-4 py-2">
              <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 text-sm space-y-1">
                <p><span className="text-slate-400">Operator:</span> <span className="capitalize text-white">{manualConv.operator_slug}</span></p>
                <p><span className="text-slate-400">Type:</span> <span className="text-white">{manualConv.conversion_type}</span></p>
                <p><span className="text-slate-400">Our amount:</span> <span className="text-green-400">{fmtCurrency(manualConv.commission_amount)}</span></p>
              </div>
              <div>
                <Label className="text-slate-300">Operator Reported Amount (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={manualAmount}
                  onChange={e => setManualAmount(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                  placeholder="e.g. 47.50"
                />
              </div>
              <div>
                <Label className="text-slate-300">Report Date</Label>
                <Input
                  type="date"
                  value={manualDate}
                  onChange={e => setManualDate(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white mt-1"
                />
              </div>
              {manualAmount && manualConv.commission_amount && (
                <div className={`text-sm p-2 rounded ${
                  Math.abs(parseFloat(manualAmount) - manualConv.commission_amount) < 0.01
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-orange-900/30 text-orange-300'
                }`}>
                  Discrepancy: {fmtCurrency(parseFloat(manualAmount || 0) - (manualConv.commission_amount || 0))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualDialog(false)} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={submitManual} disabled={submitting || !manualAmount} className="bg-purple-600 hover:bg-purple-500">
              {submitting ? "Saving…" : "Confirm Reconciliation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV import dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400" />
              Import Operator Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-400">
              Paste your operator commission report CSV below. Expected format:
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded p-3 font-mono text-xs text-slate-300">
              # conversion_id, reported_amount, report_date<br />
              550e8400-..., 47.50, 2026-03-31<br />
              6ba7b810-..., 125.00, 2026-03-31
            </div>
            <Textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white font-mono text-sm h-40"
              placeholder="Paste CSV here..."
            />
            <div>
              <Label className="text-slate-300">Operator (for reference)</Label>
              <Select value={importOperator} onValueChange={setImportOperator}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {operators.map(op => (
                    <SelectItem key={op.operator_slug} value={op.operator_slug} className="text-white hover:bg-slate-700">
                      {op.operator_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImport(false)} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={submitImport} disabled={importing || !importText.trim()} className="bg-purple-600 hover:bg-purple-500">
              {importing ? "Processing…" : "Run Reconciliation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
