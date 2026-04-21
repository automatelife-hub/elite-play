import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Mail } from "lucide-react";
import { toast } from "sonner";
import MultiStepSignup from "@/components/ui/MultiStepSignup";

export default function ReferralSignup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [sites, setSites] = useState([]);
  const [applicantEmail, setApplicantEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const allSites = await db.entities.Site.list();
      setSites(allSites);
    } catch (error) {
      console.error("Error loading sites:", error);
    }
  };

  const steps = [
    {
      title: "Platform",
      description: "Choose where you want to play",
      fields: [
        { 
          name: "platform", 
          label: "Gaming Platform", 
          type: "select", 
          placeholder: "Select platform",
          required: true,
          options: [
            { label: "Poker", value: "poker", icon: "♠️" },
            { label: "Casino", value: "casino", icon: "🎰" },
            { label: "Sportsbetting", value: "sportsbetting", icon: "⚽" },
          ]
        },
        { 
          name: "site_id", 
          label: "Specific Site", 
          type: "select", 
          placeholder: "Select a site",
          required: true,
          options: sites.map(s => ({ label: s.name, value: s.id }))
        }
      ]
    },
    {
      title: "Account",
      description: "Enter your gaming account details",
      fields: [
        { name: "player_username", label: "Player Username", placeholder: "Your username on the site", required: true },
        { name: "player_email", label: "Email Address", type: "email", placeholder: "your@email.com" }
      ]
    },
    {
      title: "Submit",
      description: "Review and complete your signup",
      fields: [
        { name: "notes", label: "Additional Info", type: "textarea", placeholder: "Any questions for our team?" }
      ]
    }
  ];

  const perks = {
    title: "Player Benefits",
    items: [
      "Exclusive Rakeback Deals",
      "VIP Support Access",
      "Private Promotions",
      "Reward Tracking",
      "Verified Gaming Sites"
    ]
  };

  const handleSubmit = async (formData) => {
    if (!referralCode) {
      toast.error("No referral code found");
      return;
    }

    setLoading(true);
    try {
      const response = await db.functions.invoke('processReferralSignup', {
        referral_code: referralCode,
        ...formData
      });

      if (response.data.success) {
        setApplicantEmail(formData.player_email);
        setSuccess(true);
        toast.success("Signup tracked successfully!");
      } else {
        toast.error(response.data.error || "Failed to process signup");
      }
    } catch (error) {
      console.error("Error submitting signup:", error);
      toast.error("Failed to process signup");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#080C14] text-white min-h-screen py-24 px-4">
        <Card className="bg-[#111827]/80 backdrop-blur-xl border-slate-800/50 max-w-2xl mx-auto rounded-[2rem] shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Signup Tracked!</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Your account details have been recorded. You're now eligible for elite rewards through your referring agent.
            </p>
            
            {applicantEmail && (
              <div className="bg-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-800 flex items-center justify-center gap-3 text-teal-400">
                <Mail className="w-5 h-5" />
                <span className="font-bold">Confirmation sent to {applicantEmail}</span>
              </div>
            )}

            <Button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-12 h-14 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="bg-[#080C14] text-white min-h-screen py-24 flex items-center justify-center px-4">
        <Card className="bg-[#111827]/80 backdrop-blur-xl border-slate-800/50 max-w-md rounded-2xl shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Referral Code</h2>
            <p className="text-slate-400">
              This page requires a valid referral code. Please use the link provided by your agent.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#080C14] text-white min-h-screen py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white mb-2">Complete Your Signup</h1>
          <p className="text-slate-400 font-bold">Referral Active: <span className="text-blue-400 font-mono">{referralCode}</span></p>
        </div>
        
        <MultiStepSignup
          steps={steps}
          perks={perks}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}