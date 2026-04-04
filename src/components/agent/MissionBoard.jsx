import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, Zap, Target, Calendar, Coins } from "lucide-react";

export default function MissionBoard({ userId }) {
  const [missions, setMissions] = useState([]);
  const [completions, setCompletions] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadMissions();
  }, [userId]);

  async function loadMissions() {
    setLoading(true);
    try {
      const [{ data: missionData }, { data: completionData }] = await Promise.all([
        supabase.from("missions").select("*").eq("is_active", true).order("type").order("xp_reward", { ascending: false }),
        supabase.from("mission_completions").select("mission_id").eq("user_id", userId),
      ]);
      setMissions(missionData ?? []);
      setCompletions(new Set((completionData ?? []).map((c) => c.mission_id)));
    } catch (err) {
      console.error("[MissionBoard]", err);
    } finally {
      setLoading(false);
    }
  }

  const daily = missions.filter((m) => m.type === "daily");
  const weekly = missions.filter((m) => m.type === "weekly");

  const dailyDone = daily.filter((m) => completions.has(m.id)).length;
  const weeklyDone = weekly.filter((m) => completions.has(m.id)).length;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Mission Board
          </CardTitle>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>{dailyDone}/{daily.length} daily</span>
            <span>·</span>
            <span>{weeklyDone}/{weekly.length} weekly</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="bg-gray-800 mb-4">
            <TabsTrigger value="daily" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Zap className="w-3 h-3 mr-1" /> Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Calendar className="w-3 h-3 mr-1" /> Weekly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <MissionList missions={daily} completions={completions} loading={loading} accentColor="emerald" />
          </TabsContent>
          <TabsContent value="weekly">
            <MissionList missions={weekly} completions={completions} loading={loading} accentColor="purple" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MissionList({ missions, completions, loading, accentColor }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!missions.length) {
    return <p className="text-gray-500 text-sm text-center py-6">No missions available right now.</p>;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {missions.map((m, idx) => {
          const done = completions.has(m.id);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                done
                  ? "border-emerald-500/20 bg-emerald-500/5 opacity-60"
                  : `border-gray-700 bg-gray-800/50 hover:border-${accentColor}-500/30`
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className={`w-5 h-5 text-${accentColor}-400 shrink-0`} />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${done ? "line-through text-gray-500" : "text-white"}`}>
                  {m.title}
                </p>
                {m.description && (
                  <p className="text-xs text-gray-500 truncate">{m.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {m.xp_reward > 0 && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                    +{m.xp_reward} XP
                  </Badge>
                )}
                {m.coin_reward > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {m.coin_reward}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
