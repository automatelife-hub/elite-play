import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Sparkles, Lock } from "lucide-react";
import confetti from "canvas-confetti";

const COLOR_CLASSES = {
  blue:   "bg-blue-500/20   border-blue-500/50   text-blue-300",
  green:  "bg-green-500/20  border-green-500/50  text-green-300",
  purple: "bg-purple-500/20 border-purple-500/50 text-purple-300",
  gold:   "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
  yellow: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
  cyan:   "bg-cyan-500/20   border-cyan-500/50   text-cyan-300",
  silver: "bg-gray-400/20   border-gray-400/50   text-gray-300",
  orange: "bg-orange-500/20 border-orange-500/50 text-orange-300",
};

export default function AchievementBadges({ agentId }) {
  const [allBadges, setAllBadges]     = useState([]);
  const [earnedIds, setEarnedIds]     = useState(new Set());
  const [loading, setLoading]         = useState(true);
  const [checking, setChecking]       = useState(false);

  const loadData = useCallback(async () => {
    if (!agentId) return;
    setLoading(true);
    try {
      // Fetch all badge definitions (ordered by sort_order)
      const { data: badges, error: badgesErr } = await supabase
        .from("badges")
        .select("*")
        .order("sort_order", { ascending: true });
      if (badgesErr) throw badgesErr;

      // Fetch which badges this agent has earned
      const { data: earned, error: earnedErr } = await supabase
        .from("agent_badges")
        .select("badge_id")
        .eq("agent_id", agentId);
      if (earnedErr) throw earnedErr;

      setAllBadges(badges || []);
      setEarnedIds(new Set((earned || []).map((r) => r.badge_id)));
    } catch (err) {
      console.error("AchievementBadges load error:", err);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  // Check for newly unlocked badges via Supabase RPC, then reload
  const checkAndRefresh = useCallback(async () => {
    if (!agentId || checking) return;
    setChecking(true);
    try {
      const { data: newlyAwarded, error } = await supabase.rpc(
        "check_and_award_badges",
        { p_agent_id: agentId }
      );
      if (!error && newlyAwarded > 0) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        await loadData();
      }
    } catch (err) {
      console.error("Badge check error:", err);
    } finally {
      setChecking(false);
    }
  }, [agentId, checking, loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (agentId) checkAndRefresh();
  }, [agentId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return null;

  const earnedCount = earnedIds.size;
  const totalPoints = allBadges
    .filter((b) => earnedIds.has(b.id))
    .reduce((sum, b) => sum + (b.xp_reward || 0), 0);

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Achievements
            <span className="ml-2 text-sm font-normal text-gray-400">
              {earnedCount}/{allBadges.length} unlocked
            </span>
          </CardTitle>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            {totalPoints} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {allBadges.map((badge) => {
            const isEarned = earnedIds.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border-2 text-center transition-transform ${
                  isEarned
                    ? `${COLOR_CLASSES[badge.color] || COLOR_CLASSES.blue} hover:scale-105 cursor-pointer`
                    : "bg-gray-900/60 border-gray-700/50 opacity-50 cursor-default"
                }`}
                title={
                  isEarned
                    ? badge.description
                    : `Locked: ${badge.description}`
                }
              >
                <div className="text-3xl mb-1 relative">
                  {isEarned ? (
                    badge.icon
                  ) : (
                    <span className="grayscale opacity-40">{badge.icon}</span>
                  )}
                  {!isEarned && (
                    <Lock className="w-3.5 h-3.5 text-gray-500 absolute -bottom-0.5 -right-0.5" />
                  )}
                </div>
                <div
                  className={`font-semibold text-xs mb-1 ${
                    isEarned ? "" : "text-gray-500"
                  }`}
                >
                  {badge.name}
                </div>
                {isEarned ? (
                  <div className="text-xs opacity-75">+{badge.xp_reward} pts</div>
                ) : (
                  <div className="text-xs text-gray-600">Locked</div>
                )}
              </div>
            );
          })}
        </div>

        {earnedCount >= 5 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              You've earned {earnedCount} badges! Keep going!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
