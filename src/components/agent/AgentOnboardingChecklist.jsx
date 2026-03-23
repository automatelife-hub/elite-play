import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AgentOnboardingChecklist({ agentId, onComplete }) {
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboarding();
  }, [agentId]);

  const loadOnboarding = async () => {
    try {
      const records = await db.entities.AgentOnboarding.filter({ agent_id: agentId });
      if (records.length > 0) {
        setOnboarding(records[0]);
      }
    } catch (error) {
      console.error("Error loading onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const checklistItems = [
    {
      key: 'payment_info_completed',
      title: 'Configure Payment Information',
      description: 'Set up how you want to receive payments',
      action: 'Go to Settings',
      completed: onboarding?.payment_info_completed
    },
    {
      key: 'profile_completed',
      title: 'Complete Your Profile',
      description: 'Add company details and contact info',
      action: 'Edit Profile',
      completed: onboarding?.profile_completed
    },
    {
      key: 'tracking_link_used',
      title: 'Copy Your First Tracking Link',
      description: 'Get links to start promoting sites',
      action: 'View Links',
      completed: onboarding?.tracking_link_used
    },
    {
      key: 'first_player_added',
      title: 'Submit Your First Player',
      description: 'Refer a player to start earning',
      action: 'Add Player',
      completed: onboarding?.first_player_added
    }
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progress = (completedCount / totalCount) * 100;
  const allCompleted = completedCount === totalCount;

  if (loading) {
    return null;
  }

  if (!onboarding) {
    return null;
  }

  if (onboarding.onboarding_completed) {
    return null;
  }

  const completeOnboarding = async () => {
    try {
      await db.entities.AgentOnboarding.update(onboarding.id, {
        onboarding_completed: true,
        completed_date: new Date().toISOString().split('T')[0]
      });
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            🎯 Get Started Checklist
          </CardTitle>
          <span className="text-sm text-gray-400">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                item.completed 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-gray-800/50 border border-gray-700'
              }`}
            >
              <div className="mt-1">
                {item.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${item.completed ? 'text-green-300' : 'text-white'}`}>
                  {item.title}
                </h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              {!item.completed && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {item.action}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {allCompleted && (
          <div className="text-center py-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Congratulations! 🎉</h3>
            <p className="text-sm text-gray-300 mb-3">You've completed all onboarding steps</p>
            <Button
              onClick={completeOnboarding}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}