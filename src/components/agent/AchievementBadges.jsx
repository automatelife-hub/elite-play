import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, Lock } from "lucide-react";
import confetti from "canvas-confetti";

export default function AchievementBadges({ agentId }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, [agentId]);

  const loadAchievements = async () => {
    if (!agentId) return;
    
    setLoading(true);
    try {
      const earned = await db.entities.AgentAchievement.filter({ agent_id: agentId });
      setAchievements(earned);
      
      const points = earned.reduce((sum, a) => sum + (a.points || 0), 0);
      setTotalPoints(points);
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkNewAchievements = async () => {
    try {
      const response = await db.functions.invoke('checkAgentAchievements', {
        agent_id: agentId
      });

      if (response.new_achievements > 0) {
        // Celebrate new achievements with confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        await loadAchievements();
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  };

  // Auto-check on mount
  useEffect(() => {
    if (agentId) {
      checkNewAchievements();
    }
  }, [agentId]);

  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    green: "bg-green-500/20 border-green-500/50 text-green-300",
    purple: "bg-purple-500/20 border-purple-500/50 text-purple-300",
    gold: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    yellow: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    cyan: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300",
    silver: "bg-gray-400/20 border-gray-400/50 text-gray-300"
  };

  if (loading) {
    return null;
  }

  if (achievements.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Start earning achievements by referring players and generating revenue!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Achievements
          </CardTitle>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {totalPoints} points
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border-2 ${
                colorClasses[achievement.badge_color] || colorClasses.blue
              } text-center transition-transform hover:scale-105 cursor-pointer`}
              title={achievement.achievement_description}
            >
              <div className="text-3xl mb-1">{achievement.badge_icon}</div>
              <div className="font-semibold text-xs mb-1">{achievement.achievement_name}</div>
              <div className="text-xs opacity-75">+{achievement.points} pts</div>
            </div>
          ))}
        </div>

        {achievements.length >= 5 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              🎉 You've earned {achievements.length} achievements! Keep going!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}