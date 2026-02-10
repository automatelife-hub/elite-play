import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function MobileSelect({ 
  value, 
  onValueChange, 
  placeholder, 
  options,
  label 
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-start text-left font-normal"
      >
        {selectedOption ? selectedOption.label : placeholder}
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="bg-slate-900 border-slate-800">
          <DrawerHeader className="border-b border-slate-800">
            <DrawerTitle className="text-white">{label || placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4">
            <div className="space-y-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                    value === option.value
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800/50 text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}