import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to AceRakeback! 🎰",
    description: "We help you find the best poker rooms with exclusive rakeback deals. Let us show you around!",
    position: "center"
  },
  {
    id: "compare",
    title: "Compare Sites",
    description: "Use our Compare feature to view multiple poker sites side-by-side and find the perfect match for your playing style.",
    target: "compare-link",
    position: "bottom"
  },
  {
    id: "affiliate",
    title: "Become an Agent",
    description: "Earn commissions by referring players to top poker sites. Join our affiliate program and start earning today!",
    target: "agent-link",
    position: "bottom"
  },
  {
    id: "advisor",
    title: "AI Poker Advisor",
    description: "Get personalized recommendations from our AI advisor. Ask questions about sites, bonuses, or poker strategy!",
    target: "advisor-link",
    position: "bottom"
  }
];

export default function OnboardingTooltip({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("acerakeback_onboarding_complete", "true");
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={handleSkip} />
      
      {/* Tooltip Card */}
      <div className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
          
          <div className="p-6">
            {/* Close button */}
            <button 
              onClick={handleSkip}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step indicator */}
            <div className="text-xs text-gray-500 mb-2">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">{step.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-300"
              >
                Skip tour
              </Button>
              
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                >
                  {isLastStep ? "Get Started" : "Next"}
                  {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>

            {/* Step dots */}
            <div className="flex justify-center gap-2 mt-6">
              {ONBOARDING_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep 
                      ? 'bg-emerald-500 w-6' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}