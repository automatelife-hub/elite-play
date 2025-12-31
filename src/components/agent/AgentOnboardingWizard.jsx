import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AgentOnboardingWizard({ agent, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentInfo, setPaymentInfo] = useState({
    payment_method: agent?.payment_method || '',
    payment_details: agent?.payment_details || ''
  });

  const steps = [
    { number: 1, title: "Welcome", icon: "👋" },
    { number: 2, title: "Payment Setup", icon: "💳" },
    { number: 3, title: "Your Benefits", icon: "⭐" },
    { number: 4, title: "Get Started", icon: "🚀" }
  ];

  const savePaymentInfo = async () => {
    try {
      await base44.entities.Agent.update(agent.id, paymentInfo);
      
      // Update onboarding progress
      const onboardingRecords = await base44.entities.AgentOnboarding.filter({ agent_id: agent.id });
      if (onboardingRecords.length > 0) {
        await base44.entities.AgentOnboarding.update(onboardingRecords[0].id, {
          payment_info_completed: true
        });
      }
      
      toast.success("Payment information saved");
      setCurrentStep(3);
    } catch (error) {
      console.error("Error saving payment info:", error);
      toast.error("Failed to save payment information");
    }
  };

  const completeOnboarding = async () => {
    try {
      const onboardingRecords = await base44.entities.AgentOnboarding.filter({ agent_id: agent.id });
      if (onboardingRecords.length > 0) {
        await base44.entities.AgentOnboarding.update(onboardingRecords[0].id, {
          setup_guide_viewed: true
        });
      }
      
      toast.success("Welcome aboard! Start referring players to earn commissions.");
      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding");
    }
  };

  const tierBenefits = {
    bronze: [
      "25% commission rate",
      "Basic reporting tools",
      "Email support",
      "Marketing materials"
    ],
    silver: [
      "30% commission rate",
      "Advanced analytics",
      "Priority email support",
      "Custom landing pages"
    ],
    gold: [
      "35% commission rate",
      "Full analytics suite",
      "Dedicated account manager",
      "Custom promotional deals"
    ]
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Welcome to AceRakeback Agency!
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  currentStep >= step.number 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                <span className="text-xs text-gray-400 mt-1">{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold mb-4">Welcome Aboard! 🎉</h2>
              <p className="text-gray-300 text-lg mb-6">
                You're now part of the AceRakeback Agency program. Let's get you set up in just a few minutes.
              </p>
              <Card className="bg-gray-800/50 border-gray-700 text-left">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Your Account Details:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tracking Code:</span>
                      <span className="font-mono text-yellow-400">{agent?.tracking_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Commission Rate:</span>
                      <span className="text-green-400 font-semibold">{agent?.commission_rate || 25}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Tier:</span>
                      <span className="text-orange-400 capitalize font-semibold">{agent?.tier || 'bronze'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={() => setCurrentStep(2)}
                className="bg-green-600 hover:bg-green-700 text-white mt-6"
              >
                Let's Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="py-4">
              <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
              <p className="text-gray-400 mb-6">Configure how you'd like to receive your commission payments</p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Payment Method *</Label>
                  <Select
                    value={paymentInfo.payment_method}
                    onValueChange={(value) => setPaymentInfo({ ...paymentInfo, payment_method: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="wire">Wire Transfer</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Payment Details *</Label>
                  <Input
                    value={paymentInfo.payment_details}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, payment_details: e.target.value })}
                    placeholder="Account number, email, or wallet address"
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your account information where payments should be sent
                  </p>
                </div>

                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-300">
                      💡 <strong>Tip:</strong> Payments are processed monthly. You'll receive an email notification when your payout is initiated.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={savePaymentInfo}
                  disabled={!paymentInfo.payment_method || !paymentInfo.payment_details}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  Save & Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="py-4">
              <h2 className="text-2xl font-bold mb-2">Your Tier Benefits</h2>
              <p className="text-gray-400 mb-6">
                You're starting at <span className="capitalize text-orange-400 font-semibold">{agent?.tier || 'Bronze'}</span> tier. 
                Earn more by referring players and generating revenue!
              </p>

              <div className="grid gap-4 mb-6">
                {Object.entries(tierBenefits).map(([tier, benefits]) => {
                  const isCurrent = tier === (agent?.tier || 'bronze');
                  return (
                    <Card key={tier} className={`${
                      isCurrent 
                        ? 'bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-orange-500/50' 
                        : 'bg-gray-800/30 border-gray-700'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold capitalize">{tier} Tier</h3>
                          {isCurrent && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              Current
                            </Badge>
                          )}
                        </div>
                        <ul className="space-y-2">
                          {benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="py-4 text-center">
              <h2 className="text-3xl font-bold mb-4">You're All Set! 🚀</h2>
              <p className="text-gray-300 text-lg mb-6">
                Your agent account is ready. Here's what you can do next:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="font-semibold mb-1">Submit Your First Player</h3>
                    <p className="text-sm text-gray-400">Start earning commissions by referring players</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">🔗</div>
                    <h3 className="font-semibold mb-1">Get Your Tracking Links</h3>
                    <p className="text-sm text-gray-400">Copy links for all available sites</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-semibold mb-1">Track Your Performance</h3>
                    <p className="text-sm text-gray-400">Monitor players, revenue, and commissions</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">💬</div>
                    <h3 className="font-semibold mb-1">Get Support</h3>
                    <p className="text-sm text-gray-400">Contact us anytime for assistance</p>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={completeOnboarding}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-8 py-6"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Badge = ({ children, className }) => (
  <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
    {children}
  </span>
);