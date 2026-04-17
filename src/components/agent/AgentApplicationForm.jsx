import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Mail, Clock } from "lucide-react";
import MultiStepSignup from "@/components/ui/MultiStepSignup";

export default function AgentApplicationForm({ onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicantEmail, setApplicantEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  const steps = [
    {
      title: "Profile",
      description: "Basic information about your agency",
      fields: [
        { name: "full_name", label: "Full Name", placeholder: "Enter your full name", required: true },
        { name: "email", label: "Email Address", type: "email", placeholder: "your@email.com", required: true },
        { name: "company_name", label: "Agency Name", placeholder: "Enter your agency name" },
        { 
          name: "primary_region", 
          label: "Primary Region", 
          type: "select", 
          placeholder: "Select country",
          options: [
            { label: "United Kingdom", value: "UK", icon: "🇬🇧" },
            { label: "Canada", value: "CA", icon: "🇨🇦" },
            { label: "Germany", value: "DE", icon: "🇩🇪" },
            { label: "Australia", value: "AU", icon: "🇦🇺" },
            { label: "United States", value: "US", icon: "🇺🇸" },
          ]
        }
      ]
    },
    {
      title: "Business Model",
      description: "How do you plan to grow your agency?",
      fields: [
        { 
          name: "preferred_plan", 
          label: "Preferred Plan", 
          type: "select", 
          placeholder: "Select a plan",
          options: [
            { label: "Performance Plan (Free at $1,500+)", value: "performance" },
            { label: "Standard Plan ($399/mo)", value: "standard" },
          ]
        },
        { name: "monthly_volume", label: "Expected Monthly Volume", placeholder: "e.g., 50-100 players per month" },
        { name: "experience", label: "Industry Experience", type: "textarea", placeholder: "Tell us about your iGaming background..." }
      ]
    },
    {
      title: "Channels",
      description: "Where will you promote your agency?",
      fields: [
        { name: "telegram", label: "Telegram Username", placeholder: "@username" },
        { name: "whatsapp", label: "WhatsApp Number", placeholder: "+1 (555) 000-0000" },
        { name: "why_join", label: "Growth Strategy", type: "textarea", placeholder: "What are your goals and how can we help?" }
      ]
    },
    {
      title: "Submit",
      description: "Finalize and send your application",
      fields: [
        { name: "notes", label: "Additional Notes", type: "textarea", placeholder: "Anything else you'd like us to know?" }
      ]
    }
  ];

  const perks = {
    title: "Perks of Starting an Agency",
    items: [
      "Dedicated Support",
      "Higher RevShare",
      "Exclusive Promotions",
      "Access to Analytics",
      "Priority Payouts"
    ]
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    toast.info("Submitting your application...");

    try {
      // Generate unique codes
      const trackingCode = `${(formData.full_name || "AGT").substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;
      const agentReferralCode = `AGT${Date.now().toString().slice(-8)}`;
      
      // Find referrer if code exists
      let referrerAgentId = null;
      if (referralCode) {
        const referrers = await db.entities.Agent.filter({ 
          agent_referral_code: referralCode 
        });
        if (referrers.length > 0) {
          referrerAgentId = referrers[0].id;
        }
      }
      
      // Create agent record
      const agent = await db.entities.Agent.create({
        agent_email: formData.email,
        agent_name: formData.full_name,
        company_name: formData.company_name,
        tracking_code: trackingCode,
        agent_referral_code: agentReferralCode,
        referrer_agent_id: referrerAgentId,
        status: "pending",
        notes: JSON.stringify({
          ...formData,
          applied_date: new Date().toISOString(),
          referred_by: referralCode || null
        })
      });

      // Create referral tracking if referred
      if (referrerAgentId) {
        await db.entities.AgentReferral.create({
          referrer_agent_id: referrerAgentId,
          referred_agent_id: agent.id,
          referral_code: referralCode,
          status: 'pending',
          referral_date: new Date().toISOString().split('T')[0]
        });
      }

      // Send confirmation email to applicant
      await db.integrations.Core.SendEmail({
        from_name: "GambleIntel Team",
        to: formData.email,
        subject: "Your Agent Application Has Been Received",
        body: `Hi ${formData.full_name}, thank you for applying! We are reviewing your application.`
      });

      setApplicantEmail(formData.email);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-[#111827]/80 backdrop-blur-xl border-slate-800/50 max-w-3xl mx-auto rounded-[2rem]">
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Application Sent!</h2>
            <p className="text-slate-400 text-lg mb-6">
              We've received your request to join GambleIntel as an agent. Our team will reach out shortly.
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-8 mb-8 space-y-4 border border-slate-800">
            <div className="flex items-center justify-center gap-3 text-teal-400">
              <Mail className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-xs">Verification Sent</span>
            </div>
            <p className="text-slate-300">
              Check your inbox at <span className="text-white font-black">{applicantEmail}</span>
            </p>
          </div>

          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 h-12 rounded-xl"
          >
            Back to Top
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <MultiStepSignup
      steps={steps}
      perks={perks}
      onSubmit={handleSubmit}
      initialData={{ preferred_plan: "performance", primary_region: "UK" }}
    />
  );
}