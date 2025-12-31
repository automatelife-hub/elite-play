import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function PaymentRequestDialog({ open, onOpenChange, pendingAmount, agentId }) {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [amount, setAmount] = useState(pendingAmount.toFixed(2));
  const [paymentDetails, setPaymentDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const minAmount = 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestAmount = parseFloat(amount);
    if (requestAmount < minAmount) {
      toast.error(`Minimum payment request is $${minAmount}`);
      return;
    }

    if (requestAmount > pendingAmount) {
      toast.error(`Cannot request more than pending amount ($${pendingAmount.toFixed(2)})`);
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd create a payment request entity or call a backend function
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Payment request submitted successfully! Admin will process within 24-48 hours.");
      onOpenChange(false);
      
      // Reset form
      setAmount(pendingAmount.toFixed(2));
      setPaymentDetails("");
      setNotes("");
    } catch (error) {
      console.error("Error submitting payment request:", error);
      toast.error("Failed to submit payment request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Wallet className="w-5 h-5 mr-2 text-yellow-400" />
            Request Payment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Available Balance */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Available Balance</div>
              <div className="text-2xl font-bold text-yellow-400">
                ${pendingAmount.toFixed(2)}
              </div>
            </div>

            {/* Amount */}
            <div>
              <Label className="text-gray-300">Request Amount *</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={minAmount}
                  max={pendingAmount}
                  step="0.01"
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: ${minAmount} • Maximum: ${pendingAmount.toFixed(2)}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-gray-300">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="skrill">Skrill</SelectItem>
                  <SelectItem value="neteller">Neteller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Details */}
            <div>
              <Label className="text-gray-300">Payment Details *</Label>
              <Textarea
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder={
                  paymentMethod === 'bank' ? 'Bank name, Account number, Routing number' :
                  paymentMethod === 'crypto' ? 'Wallet address, Cryptocurrency type' :
                  'Email or account ID'
                }
                className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[80px]"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <Label className="text-gray-300">Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information..."
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>

            {/* Processing Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-300">
                <strong className="text-blue-400">Processing Time:</strong> 24-48 hours
                <br />
                <strong className="text-blue-400">Payment Day:</strong> Every Friday
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}