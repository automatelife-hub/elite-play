import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Compare() {
  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="py-16 text-center">
            <Construction className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Coming Soon</h2>
            <p className="text-gray-500">Site comparison tool is under development</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}