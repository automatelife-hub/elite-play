import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, CheckCircle, XCircle, Clock, AlertCircle, Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import logger from "@/lib/logger";

export default function AdminPayouts() {
  const [user, setUser] = useState(null);
  const [payoutBatches, setPayoutBatches] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);

      if (currentUser.role !== 'admin') {
        toast.error("Admin access required");
        return;
      }

      const [batches, agentsList] = await Promise.all([
        db.entities.PayoutBatch.list('-created_date'),
        db.entities.Agent.list()
      ]);

      setPayoutBatches(batches);
      setAgents(agentsList);
    } catch (error) {
      logger.error("Error loading data in AdminPayouts:", error);
      toast.error("Failed to load payout data");
    } finally {
      setLoading(false);
    }
  };

  const processAutomatedPayouts = async () => {
    setProcessing(true);
    try {
      const response = await db.functions.invoke('processPayouts', {});
      
      if (response.success) {
        toast.success(response.message);
        await loadData();
      } else {
        toast.error(response.error || "Failed to process payouts");
      }
    } catch (error) {
      logger.error("Error processing automated payouts:", error);
      toast.error("Failed to process automated payouts");
    } finally {
      setProcessing(false);
    }
  };

  const approveBatch = async (batchId) => {
    try {
      await db.entities.PayoutBatch.update(batchId, {
        status: 'approved',
        approved_by: user.email
      });

      toast.success("Batch approved");
      await loadData();
    } catch (error) {
      logger.error("Error approving payout batch:", error);
      toast.error("Failed to approve batch");
    }
  };

  const executePayout = async (batchId) => {
    setProcessing(true);
    try {
      const response = await db.functions.invoke('executePayout', {
        batch_id: batchId
      });

      if (response.success) {
        toast.success(`Payout processed! Transaction ID: ${response.transaction_id}`);
        await loadData();
      } else {
        toast.error(response.error || "Failed to execute payout");
      }
    } catch (error) {
      logger.error("Error executing payout batch:", error);
      toast.error("Failed to execute payout");
    } finally {
      setProcessing(false);
    }
  };

  const rejectBatch = async () => {
    if (!selectedBatch || !rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await db.entities.PayoutBatch.update(selectedBatch.id, {
        status: 'rejected',
        rejection_reason: rejectionReason
      });

      // Update commissions back to pending
      for (const commissionId of selectedBatch.commission_ids) {
        await db.entities.AgentCommission.update(commissionId, {
          payout_status: 'pending'
        });
      }

      toast.success("Batch rejected");
      setShowRejectDialog(false);
      setSelectedBatch(null);
      setRejectionReason("");
      await loadData();
    } catch (error) {
      logger.error("Error rejecting payout batch:", error);
      toast.error("Failed to reject batch");
    }
  };

  const statusConfig = {
    pending_approval: {
      label: "Pending Approval",
      icon: Clock,
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    },
    approved: {
      label: "Approved",
      icon: CheckCircle,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    processing: {
      label: "Processing",
      icon: RefreshCw,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      color: "bg-green-500/20 text-green-400 border-green-500/30"
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      color: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    rejected: {
      label: "Rejected",
      icon: AlertCircle,
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  };

  const filteredBatches = payoutBatches.filter(batch => 
    statusFilter === "all" || batch.status === statusFilter
  );

  const pendingApprovalCount = payoutBatches.filter(b => b.status === 'pending_approval').length;
  const totalPendingAmount = payoutBatches
    .filter(b => b.status === 'pending_approval')
    .reduce((sum, b) => sum + b.total_amount, 0);

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">This page is only accessible to administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Payout Management</h1>
            <p className="text-gray-400">Review and process agent commission payouts</p>
          </div>
          <Button
            onClick={processAutomatedPayouts}
            disabled={processing}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
          >
            {processing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Automated Payouts
              </>
            )}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{pendingApprovalCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                ${totalPendingAmount.toFixed(2)} total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {payoutBatches.filter(b => b.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">
                {payoutBatches.filter(b => b.status === 'failed').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Batches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {payoutBatches.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Filter by status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payout Batches */}
        <div className="space-y-4">
          {filteredBatches.map(batch => {
            const agent = agents.find(a => a.id === batch.agent_id);
            const status = statusConfig[batch.status];
            const StatusIcon = status.icon;

            return (
              <Card key={batch.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {agent?.agent_name || 'Unknown Agent'}
                        </h3>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-white font-semibold ml-2">
                            ${batch.total_amount.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Payment Method:</span>
                          <span className="text-white ml-2">{batch.payment_method || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Created:</span>
                          <span className="text-white ml-2">
                            {format(new Date(batch.created_date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      {batch.transaction_id && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-400">Transaction ID:</span>
                          <span className="text-green-400 ml-2 font-mono">{batch.transaction_id}</span>
                        </div>
                      )}
                      {batch.rejection_reason && (
                        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="text-sm text-red-400 font-medium">Rejection Reason:</div>
                          <div className="text-sm text-gray-300 mt-1">{batch.rejection_reason}</div>
                        </div>
                      )}
                      {batch.notes && (
                        <div className="mt-2 text-sm text-gray-400">
                          <span className="font-medium">Notes:</span> {batch.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {batch.status === 'pending_approval' && (
                        <>
                          <Button
                            onClick={() => approveBatch(batch.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedBatch(batch);
                              setShowRejectDialog(true);
                            }}
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {batch.status === 'approved' && (
                        <Button
                          onClick={() => executePayout(batch.id)}
                          disabled={processing}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Execute Payout
                        </Button>
                      )}
                      {batch.status === 'failed' && (
                        <Button
                          onClick={() => executePayout(batch.id)}
                          disabled={processing}
                          variant="outline"
                          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredBatches.length === 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-12 text-center">
                <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No payout batches found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Reject Payout Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-400">
              Please provide a reason for rejecting this payout batch. The agent will be notified.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
                setSelectedBatch(null);
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={rejectBatch}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}