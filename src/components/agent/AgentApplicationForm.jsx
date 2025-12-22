import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export default function AgentApplicationForm({ onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    whatsapp: "",
    telegram: "",
    traffic_sources: {
      social_media: false,
      seo_organic: false,
      paid_ads: false,
      email_marketing: false,
      influencer_marketing: false,
      content_marketing: false,
      affiliate_network: false,
      other: false
    },
    traffic_sources_other: "",
    monthly_volume: "",
    experience: "",
    why_join: "",
    preferred_plan: "performance"
  });

  const handleCheckboxChange = (source) => {
    setFormData({
      ...formData,
      traffic_sources: {
        ...formData.traffic_sources,
        [source]: !formData.traffic_sources[source]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate at least one traffic source is selected
    const hasTrafficSource = Object.values(formData.traffic_sources).some(v => v === true);
    if (!hasTrafficSource) {
      toast.error("Please select at least one traffic source");
      return;
    }
    
    setSubmitting(true);
    toast.info("Submitting your application...");

    try {
      console.log("Creating agent record...");
      // Create agent record
      await base44.entities.Agent.create({
        agent_email: formData.email,
        agent_name: formData.full_name,
        company_name: formData.company_name,
        status: "pending",
        notes: JSON.stringify({
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          telegram: formData.telegram,
          traffic_sources: formData.traffic_sources,
          traffic_sources_other: formData.traffic_sources_other,
          monthly_volume: formData.monthly_volume,
          experience: formData.experience,
          why_join: formData.why_join,
          preferred_plan: formData.preferred_plan,
          applied_date: new Date().toISOString()
        })
      });
      console.log("Agent record created successfully");

      console.log("Sending confirmation email to applicant...");
      // Send confirmation email to applicant
      await base44.integrations.Core.SendEmail({
        from_name: "AceRakeback Team",
        to: formData.email,
        subject: "Your Agent Application Has Been Received",
        body: `
Hi ${formData.full_name},

Thank you for applying to become an AceRakeback agent!

We've successfully received your application and our team is reviewing it. You can expect to hear back from us within 24-48 hours.

In the meantime, feel free to explore our platform and reach out if you have any questions.

Application Details:
- Name: ${formData.full_name}
- Email: ${formData.email}
- Company: ${formData.company_name || 'N/A'}
- Preferred Plan: ${formData.preferred_plan === 'performance' ? 'Performance Plan (Free at $1,500+)' : 'Standard Plan ($399/mo)'}

Best regards,
The AceRakeback Team

---
This is an automated confirmation email. Please do not reply directly to this message.
        `
      });

      console.log("Sending notification email to admin...");
      // Send notification email to admin
      await base44.integrations.Core.SendEmail({
        from_name: "Agent Application System",
        to: "admin@acerakeback.com",
        subject: `🚨 New Agent Application: ${formData.full_name}`,
        body: `
New agent application received!

CONTACT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.full_name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company_name || 'N/A'}
WhatsApp: ${formData.whatsapp || 'N/A'}
Telegram: ${formData.telegram || 'N/A'}

TRAFFIC & BUSINESS:
━━━━━━━━━━━━━━━━━━━━━━━━
Traffic Sources: ${Object.keys(formData.traffic_sources).filter(k => formData.traffic_sources[k]).map(s => s.replace('_', ' ')).join(', ')}
${formData.traffic_sources_other ? `Other Sources: ${formData.traffic_sources_other}` : ''}
Expected Monthly Volume: ${formData.monthly_volume || 'Not specified'}

EXPERIENCE:
${formData.experience}

WHY JOIN:
${formData.why_join}

PREFERRED PLAN: ${formData.preferred_plan === 'performance' ? 'Performance Plan (Free at $1,500+)' : 'Standard Plan ($399/mo)'}

━━━━━━━━━━━━━━━━━━━━━━━━
Applied: ${new Date().toLocaleString()}
        `
      });

      console.log("Application submitted successfully!");
      toast.success("Application submitted successfully! Check your email for confirmation.");
      
      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        whatsapp: "",
        telegram: "",
        traffic_sources: {
          social_media: false,
          seo_organic: false,
          paid_ads: false,
          email_marketing: false,
          influencer_marketing: false,
          content_marketing: false,
          affiliate_network: false,
          other: false
        },
        traffic_sources_other: "",
        monthly_volume: "",
        experience: "",
        why_join: "",
        preferred_plan: "performance"
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(`Failed to submit application: ${error.message || 'Please try again'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-white text-center">Agent Application Form</CardTitle>
        <p className="text-slate-400 text-center">Fill out the form below to start your agency journey</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name" className="text-slate-300">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company_name" className="text-slate-300">Company/Agency Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Optional"
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp" className="text-slate-300">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="telegram" className="text-slate-300">Telegram Username</Label>
                <Input
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  placeholder="@username"
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                />
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Traffic Sources *</h3>
            <p className="text-sm text-slate-400">Select all that apply</p>
            
            <div className="grid md:grid-cols-2 gap-3">
              {Object.keys(formData.traffic_sources).filter(k => k !== 'other').map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={source}
                    checked={formData.traffic_sources[source]}
                    onCheckedChange={() => handleCheckboxChange(source)}
                    className="border-slate-600"
                  />
                  <Label htmlFor={source} className="text-slate-300 cursor-pointer capitalize">
                    {source.replace('_', ' ')}
                  </Label>
                </div>
              ))}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={formData.traffic_sources.other}
                  onCheckedChange={() => handleCheckboxChange('other')}
                  className="border-slate-600"
                />
                <Label htmlFor="other" className="text-slate-300 cursor-pointer">
                  Other
                </Label>
              </div>
            </div>

            {formData.traffic_sources.other && (
              <div>
                <Label htmlFor="traffic_sources_other" className="text-slate-300">Please specify other traffic sources</Label>
                <Input
                  id="traffic_sources_other"
                  value={formData.traffic_sources_other}
                  onChange={(e) => setFormData({ ...formData, traffic_sources_other: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="Describe your traffic sources"
                />
              </div>
            )}
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Business Details</h3>
            
            <div>
              <Label htmlFor="monthly_volume" className="text-slate-300">Expected Monthly Player Volume</Label>
              <Input
                id="monthly_volume"
                value={formData.monthly_volume}
                onChange={(e) => setFormData({ ...formData, monthly_volume: e.target.value })}
                placeholder="e.g., 50-100 players per month"
                className="bg-slate-800 border-slate-700 text-white mt-1"
              />
            </div>

            <div>
              <Label htmlFor="experience" className="text-slate-300">Your Experience in iGaming/Affiliate Marketing *</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Tell us about your experience in the industry..."
                className="bg-slate-800 border-slate-700 text-white mt-1 h-24"
                required
              />
            </div>

            <div>
              <Label htmlFor="why_join" className="text-slate-300">Why do you want to become an agent? *</Label>
              <Textarea
                id="why_join"
                value={formData.why_join}
                onChange={(e) => setFormData({ ...formData, why_join: e.target.value })}
                placeholder="What are your goals and how can we help you achieve them?"
                className="bg-slate-800 border-slate-700 text-white mt-1 h-24"
                required
              />
            </div>

            <div>
              <Label className="text-slate-300">Preferred Plan *</Label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="standard"
                    name="plan"
                    value="standard"
                    checked={formData.preferred_plan === "standard"}
                    onChange={(e) => setFormData({ ...formData, preferred_plan: e.target.value })}
                    className="text-blue-500"
                  />
                  <Label htmlFor="standard" className="text-slate-300 cursor-pointer">
                    Standard Plan ($399/mo)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="performance"
                    name="plan"
                    value="performance"
                    checked={formData.preferred_plan === "performance"}
                    onChange={(e) => setFormData({ ...formData, preferred_plan: e.target.value })}
                    className="text-purple-500"
                  />
                  <Label htmlFor="performance" className="text-slate-300 cursor-pointer">
                    Performance Plan (Free at $1,500+)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 text-lg"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Application
              </>
            )}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By submitting this form, you agree to our terms of service and privacy policy. 
            We'll review your application and respond within 24-48 hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}