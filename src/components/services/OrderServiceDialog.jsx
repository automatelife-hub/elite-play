import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export default function OrderServiceDialog({ open, onClose, service, agentId, onSuccess }) {
  const [orderForm, setOrderForm] = useState({
    order_details: "",
    files_provided: []
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setOrderForm({
      ...orderForm,
      files_provided: [...orderForm.files_provided, ...uploadedUrls]
    });

    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} file(s) uploaded`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Default 7 days

      await base44.entities.ServiceOrder.create({
        agent_id: agentId,
        service_package_id: service.id,
        total_price: service.price,
        order_details: orderForm.order_details,
        files_provided: orderForm.files_provided,
        due_date: dueDate.toISOString().split('T')[0],
        status: "pending"
      });

      onSuccess();
      setOrderForm({ order_details: "", files_provided: [] });
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Failed to submit order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card text-white border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order: {service.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Service Info */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-white">{service.name}</div>
                  <div className="text-sm text-gray-400">{service.category}</div>
                </div>
                <div className="text-2xl font-bold text-emerald-400">${service.price}</div>
              </div>
              {service.turnaround_time && (
                <div className="text-sm text-gray-400">
                  Turnaround: {service.turnaround_time}
                </div>
              )}
            </div>

            {/* Requirements Note */}
            {service.requirements && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <div className="text-sm font-semibold text-yellow-400 mb-1">Required:</div>
                <div className="text-sm text-gray-300">{service.requirements}</div>
              </div>
            )}

            {/* Order Details */}
            <div>
              <Label className="text-gray-300">Project Details *</Label>
              <Textarea
                value={orderForm.order_details}
                onChange={(e) => setOrderForm({ ...orderForm, order_details: e.target.value })}
                placeholder="Describe your requirements, goals, target audience, brand guidelines, etc."
                className="bg-slate-800/50 border-slate-700 text-white mt-1 min-h-32"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-gray-300">Upload Files (Optional)</Label>
              <div className="mt-1">
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">
                      Click to upload files (images, videos, documents)
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                </label>
              </div>
              {orderForm.files_provided.length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
                  {orderForm.files_provided.length} file(s) uploaded
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500"
            >
              {submitting ? "Submitting..." : "Place Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}