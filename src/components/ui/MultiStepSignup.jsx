import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function MultiStepSignup({ 
  title, 
  subtitle, 
  steps, 
  perks, 
  onSubmit, 
  initialData,
  onStepChange 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (onStepChange) onStepChange(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (onStepChange) onStepChange(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#111827]/80 backdrop-blur-xl rounded-[2rem] border border-slate-800/50 shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
      {/* Left Column: Perks */}
      <div className="w-full md:w-1/3 bg-[#0F172A] p-8 md:p-12 border-r border-slate-800/50">
        <h2 className="text-2xl font-black text-white mb-8 leading-tight">
          {perks.title || "Perks of Starting an Agency"}
        </h2>
        
        <ul className="space-y-6">
          {perks.items.map((perk, idx) => (
            <li key={idx} className="flex items-center gap-4 text-slate-300 font-bold text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              {perk}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 p-8 md:p-12 flex flex-col">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12 relative px-4">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all duration-300 ${
                  idx <= currentStep ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-800 text-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-black transition-all duration-300 ${
                  idx <= currentStep ? 'text-blue-400' : 'text-slate-600'
                }`}>
                  {idx + 1}. {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 -mt-10 bg-slate-800 overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600"
                    initial={{ width: "0%" }}
                    animate={{ width: idx < currentStep ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <h3 className="text-xl font-black text-white mb-2">{steps[currentStep].title}</h3>
          <p className="text-slate-400 text-sm mb-8">{steps[currentStep].description}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {steps[currentStep].fields.map((field, idx) => (
                <div key={idx} className="space-y-2">
                  <Label className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  
                  {field.type === 'select' ? (
                    <Select 
                      value={formData[field.name]} 
                      onValueChange={(val) => updateField(field.name, val)}
                    >
                      <SelectTrigger className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12 focus:ring-blue-600 focus:border-blue-600">
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        {field.options.map((opt, oIdx) => (
                          <SelectItem key={oIdx} value={opt.value}>
                            <div className="flex items-center gap-2">
                              {opt.icon && <span className="text-lg">{opt.icon}</span>}
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      value={formData[field.name] || ""}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="bg-slate-900/50 border-slate-800 text-white rounded-xl min-h-[120px] focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <Input
                      type={field.type || "text"}
                      value={formData[field.name] || ""}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="bg-slate-900/50 border-slate-800 text-white rounded-xl h-12 focus:ring-blue-600 focus:border-blue-600"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-12">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="text-slate-400 hover:text-white font-bold"
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 h-12 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all min-w-[140px]"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : currentStep === steps.length - 1 ? (
              "Submit"
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 w-4 h-4" strokeWidth={3} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
