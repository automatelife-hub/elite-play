import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Zap, Target, Calendar, Coins, Timer, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ── Countdown helpers ───────────────────────────────────────────────────────

function getMsUntilDailyReset() {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return Math.max(0, tomorrow.getTime() - now.getTime());
}

function getMsUntilWeeklyReset() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun … 6=Sat
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  const nextMonday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilMonday)
  );
  return Math.max(0, nextMonday.getTime() - now.getTime());
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useCountdown(getFn) {
  const [value, setValue] = useState(getFn);
  useEffect(() => {
    const id = setInterval(() => setValue(getFn()), 1000);
    return () => clearInterval(id);
  }, [getFn]);
  return value;
}

// ── Confetti burst ──────────────────────────────────────────────────────────

function fireCelebration() {
  const opts = { spread: 80, startVelocity: 35, gravity: 1.2 };
  confetti({ ...opts, particleCount: 60, origin: { x: 0.3, y: 0.6 }, colors: ["#10b981", "#06b6d4", "#a855f7"] });
  confetti({ ...opts, particleCount: 60, origin: { x: 0.7, y: 0.6 }, colors: ["#f59e0b", "#ef4444", "#3b82f6"] });
}

// ── Main component ──────────────────────────────────────────────────────────

export default function MissionBoard({ userId }) {
  const [missions, setMissions] = useState([]);
  // keyed by mission_id → { progress, completed }
  const [userProgress, setUserProgress] = useState({});
  const [completing, setCompleting] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const dailyMs = useCountdown(getMsUntilDailyReset);
  const weeklyMs = useCountdown(getMsUntilWeeklyReset);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const [{ data: missionData }, { data: progressData }] = await Promise.all([
        supabase
          .from("missions")
          .select("*")
          .eq("is_active", true)
          .lte("active_from", now)
          .gte("active_to", now)
          .order("type")
          .order("xp_reward", { ascending: false }),
        supabase
          .from("user_missions")
          .select("mission_id, progress, completed")
          .eq("user_id", userId),
      ]);

      setMissions(missionData ?? []);

      const map = {};
      for (const row of progressData ?? []) {
        map[row.mission_id] = { progress: row.progress ?? 0, completed: row.completed ?? false };
      }
      setUserProgress(map);
    } catch (err) {
      console.error("[MissionBoard] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleComplete = useCallback(
    async (mission) => {
      if (!userId || completing.has(mission.id)) return;

      const already = userProgress[mission.id]?.completed;
      if (already) return;

      // Optimistic update
      setCompleting((prev) => new Set([...prev, mission.id]));
      setUserProgress((prev) => ({
        ...prev,
        [mission.id]: { progress: mission.target_count ?? 1, completed: true },
      }));

      try {
        const { data, error } = await supabase.functions.invoke("award-xp", {
          body: {
            userId,
            action: "complete_mission",
            metadata: { missionId: mission.id },
          },
        });

        if (error) throw error;

        fireCelebration();
        toast.success(
          `Mission complete! +${data?.xpEarned ?? mission.xp_reward} XP${
            data?.coinsEarned ? ` · +${data.coinsEarned} Dark Coins` : ""
          }${data?.tierUpgraded ? ` · 🎉 Tier up → ${data.tier}!` : ""}`
        );
      } catch (err) {
        console.error("[MissionBoard] complete error:", err);
        // Revert optimistic update
        setUserProgress((prev) => ({
          ...prev,
          [mission.id]: { progress: prev[mission.id]?.progress ?? 0, completed: false },
        }));
        toast.error("Failed to complete mission. Please try again.");
      } finally {
        setCompleting((prev) => {
          const next = new Set(prev);
          next.delete(mission.id);
          return next;
        });
      }
    },
    [userId, completing, userProgress]
  );

  const daily = missions.filter((m) => m.type === "daily");
  const weekly = missions.filter((m) => m.type === "weekly");

  const dailyDone = daily.filter((m) => userProgress[m.id]?.completed).length;
  const weeklyDone = weekly.filter((m) => userProgress[m.id]?.completed).length;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Mission Board
          </CardTitle>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>
              {dailyDone}/{daily.length} daily
            </span>
            <span>·</span>
            <span>
              {weeklyDone}/{weekly.length} weekly
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="bg-gray-800 mb-4 w-full">
            <TabsTrigger
              value="daily"
              className="flex-1 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Zap className="w-3 h-3 mr-1" /> Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="flex-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Calendar className="w-3 h-3 mr-1" /> Weekly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <CountdownBar ms={dailyMs} label="Resets in" color="emerald" />
            <MissionList
              missions={daily}
              userProgress={userProgress}
              completing={completing}
              loading={loading}
              accentColor="emerald"
              onComplete={handleComplete}
            />
          </TabsContent>

          <TabsContent value="weekly">
            <CountdownBar ms={weeklyMs} label="Resets Monday" color="purple" />
            <MissionList
              missions={weekly}
              userProgress={userProgress}
              completing={completing}
              loading={loading}
              accentColor="purple"
              onComplete={handleComplete}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ── Countdown banner ────────────────────────────────────────────────────────

function CountdownBar({ ms, label, color }) {
  const colorMap = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  };
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs mb-3 ${colorMap[color] ?? colorMap.emerald}`}
    >
      <Timer className="w-3 h-3 shrink-0" />
      <span className="text-gray-400">{label}:</span>
      <span className="font-mono font-semibold">{formatCountdown(ms)}</span>
    </div>
  );
}

// ── Mission list ────────────────────────────────────────────────────────────

function MissionList({ missions, userProgress, completing, loading, accentColor, onComplete }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!missions.length) {
    return (
      <p className="text-gray-500 text-sm text-center py-6">No missions available right now.</p>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {missions.map((m, idx) => {
          const up = userProgress[m.id] ?? { progress: 0, completed: false };
          const done = up.completed;
          const target = m.target_count ?? 1;
          const progress = Math.min(up.progress, target);
          const pct = target > 0 ? Math.round((progress / target) * 100) : 0;
          const isCompleting = completing.has(m.id);

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`p-3 rounded-lg border transition-all ${
                done
                  ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
                  : `border-gray-700 bg-gray-800/50 hover:border-${accentColor}-500/30`
              }`}
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-${accentColor}-500/60 flex items-center justify-center`}
                    >
                      {isCompleting && (
                        <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium leading-tight ${
                      done ? "line-through text-gray-500" : "text-white"
                    }`}
                  >
                    {m.title}
                  </p>
                  {m.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{m.description}</p>
                  )}
                </div>

                {/* Rewards */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  {m.xp_reward > 0 && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      +{m.xp_reward} XP
                    </Badge>
                  )}
                  {m.coin_reward > 0 && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs flex items-center gap-0.5">
                      <Coins className="w-3 h-3" />
                      {m.coin_reward}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress bar (shown when target > 1 or in progress) */}
              {target > 1 && (
                <div className="mt-2 ml-8">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {progress} / {target}
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <Progress
                    value={pct}
                    className={`h-1.5 bg-gray-700 [&>div]:bg-${accentColor}-500`}
                  />
                </div>
              )}

              {/* Complete button */}
              {!done && (
                <div className="mt-2 ml-8">
                  <Button
                    size="sm"
                    disabled={isCompleting}
                    onClick={() => onComplete(m)}
                    className={`h-7 text-xs bg-${accentColor}-600/20 hover:bg-${accentColor}-600/40 text-${accentColor}-300 border border-${accentColor}-500/30 disabled:opacity-50`}
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Claiming…
                      </>
                    ) : (
                      "Complete"
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
