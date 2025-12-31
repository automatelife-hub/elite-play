import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  FileText, 
  Gift, 
  ArrowRight,
  CheckCircle2,
  PlayCircle
} from "lucide-react";

export default function AgentDemo() {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: 'add-players',
      icon: Users,
      title: 'Add Players',
      color: 'emerald',
      description: 'Track and manage your player referrals',
      instructions: [
        'Navigate to the Agent Portal from the main menu',
        'Click on the "Add Player" button in your dashboard',
        'Fill in player details: username, email, and platform (Poker/Casino/Sportsbetting)',
        'Select the site where the player signed up',
        'Submit the form - player status will be "Pending" until approved',
        'Once approved by admin, you can track their activity and earnings'
      ],
      tips: [
        'Keep player usernames accurate for tracking',
        'Add players immediately after signup for better tracking',
        'You can add notes to each player for reference'
      ]
    },
    {
      id: 'request-deals',
      icon: FileText,
      title: 'Request Custom Deals',
      color: 'cyan',
      description: 'Negotiate better rates for your players',
      instructions: [
        'Go to Agent Portal > Featured Offers section',
        'Browse available sites and their commission rates',
        'Contact admin through the portal or WhatsApp button',
        'Provide details: expected player volume, site preference, current deals',
        'Admin will review and respond with custom deal terms',
        'Once approved, your custom rates will be applied automatically'
      ],
      tips: [
        'Higher volume = better negotiating power',
        'Be specific about your player demographics',
        'Build trust with consistent referrals first'
      ]
    },
    {
      id: 'request-payment',
      icon: DollarSign,
      title: 'Request Payments',
      color: 'yellow',
      description: 'Get paid for your commissions',
      instructions: [
        'Check your commission balance in Agent Portal > Dashboard',
        'Ensure you meet minimum withdrawal amount ($100+)',
        'Click "Request Payment" button',
        'Select your payment method (Bank Transfer, Crypto, eWallet)',
        'Fill in payment details if not already on file',
        'Submit request - admin processes within 48 hours',
        'Track payment status in "Payment History" section'
      ],
      tips: [
        'Update payment info in Profile settings',
        'Payments are processed weekly on Fridays',
        'Keep transaction records for tax purposes'
      ]
    },
    {
      id: 'promotions',
      icon: Gift,
      title: 'Access Promotional Materials',
      color: 'purple',
      description: 'Get marketing assets and exclusive offers',
      instructions: [
        'Visit Agent Portal > Promotional Materials section',
        'Download banners, logos, and marketing images',
        'Copy your unique tracking links for each site',
        'Access exclusive bonus codes for your players',
        'View current promotions and rake races',
        'Use WhatsApp link to get personalized promo support'
      ],
      tips: [
        'Update your promotional content regularly',
        'Track which materials perform best',
        'Always use your unique tracking links'
      ]
    }
  ];

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      hover: 'hover:bg-emerald-500/20'
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      hover: 'hover:bg-cyan-500/20'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      hover: 'hover:bg-yellow-500/20'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      hover: 'hover:bg-purple-500/20'
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <PlayCircle className="w-4 h-4 mr-2" />
            Demo Tutorial
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Agent Platform <span className="text-emerald-400">Tutorial</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn how to maximize your earnings with our agent platform. Follow these step-by-step guides to get started.
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step) => {
            const colors = colorClasses[step.color];
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <Card 
                key={step.id}
                className={`bg-gray-900 border-gray-800 cursor-pointer transition-all duration-300 ${
                  isActive ? `border-2 ${colors.border} ${colors.bg}` : `hover:border-gray-700 ${colors.hover}`
                }`}
                onClick={() => setActiveStep(isActive ? null : step.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {step.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`w-full ${colors.border} ${colors.text} ${colors.hover}`}
                  >
                    {isActive ? 'Hide Details' : 'View Guide'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Instructions */}
        {activeStep && (
          <div className="mb-12">
            {steps.filter(s => s.id === activeStep).map((step) => {
              const colors = colorClasses[step.color];
              const Icon = step.icon;

              return (
                <Card key={step.id} className={`bg-gray-900 border-2 ${colors.border}`}>
                  <CardHeader className={`${colors.bg} border-b ${colors.border}`}>
                    <CardTitle className="flex items-center text-2xl">
                      <Icon className={`w-8 h-8 mr-3 ${colors.text}`} />
                      <span className={colors.text}>{step.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Instructions */}
                      <div>
                        <h4 className="text-xl font-semibold mb-4 text-white">
                          📋 Step-by-Step Instructions
                        </h4>
                        <div className="space-y-3">
                          {step.instructions.map((instruction, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className={`w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 font-semibold text-sm`}>
                                {idx + 1}
                              </div>
                              <p className="text-gray-300 leading-relaxed">{instruction}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="text-xl font-semibold mb-4 text-white">
                          💡 Pro Tips
                        </h4>
                        <div className="space-y-3">
                          {step.tips.map((tip, idx) => (
                            <div 
                              key={idx} 
                              className={`p-4 ${colors.bg} border ${colors.border} rounded-lg`}
                            >
                              <div className="flex items-start">
                                <CheckCircle2 className={`w-5 h-5 ${colors.text} mr-3 flex-shrink-0 mt-0.5`} />
                                <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className={`mt-6 p-5 bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-lg`}>
                          <p className={`text-sm ${colors.text} font-semibold mb-2`}>
                            Need Help?
                          </p>
                          <p className="text-gray-300 text-sm mb-3">
                            Contact our support team 24/7 via WhatsApp or the agent portal.
                          </p>
                          <Button size="sm" className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Additional Resources */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">📚 Additional Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-emerald-400">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Agent Portal Dashboard</li>
                  <li>• Payment History</li>
                  <li>• Player Management</li>
                  <li>• Commission Calculator</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-cyan-400">Support Channels</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• WhatsApp: +1 (555) 123-4567</li>
                  <li>• Email: agents@acerakeback.com</li>
                  <li>• Live Chat: 24/7 Support</li>
                  <li>• FAQ & Knowledge Base</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-purple-400">Payment Info</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Minimum: $100</li>
                  <li>• Processing: 24-48 hours</li>
                  <li>• Methods: Bank, Crypto, eWallet</li>
                  <li>• Payment Day: Every Friday</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Ready to start earning?</p>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8 py-6 text-lg">
            Go to Agent Portal
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}