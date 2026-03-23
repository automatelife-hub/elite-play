import { createServiceClient, getAuthUser } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const user = await getAuthUser(req, db);

    if (!user || (!user.is_agent && user.role !== "admin")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agent_id } = await req.json();
    if (!agent_id) {
      return Response.json({ error: "Missing agent_id" }, { status: 400 });
    }

    const ACHIEVEMENTS = [
      { id: "first_player", name: "First Steps", description: "Referred your first player", icon: "target", color: "blue", points: 10, check: (d: any) => d.players >= 1 },
      { id: "ten_players", name: "Growing Network", description: "Referred 10 players", icon: "users", color: "green", points: 50, check: (d: any) => d.players >= 10 },
      { id: "fifty_players", name: "Agent Elite", description: "Referred 50 players", icon: "star", color: "purple", points: 200, check: (d: any) => d.players >= 50 },
      { id: "hundred_players", name: "Master Recruiter", description: "Referred 100 players", icon: "crown", color: "gold", points: 500, check: (d: any) => d.players >= 100 },
      { id: "first_1k_revenue", name: "First $1,000", description: "Generated $1,000 in revenue", icon: "dollar", color: "green", points: 25, check: (d: any) => d.revenue >= 1000 },
      { id: "first_10k_revenue", name: "$10K Club", description: "Generated $10,000 in revenue", icon: "money", color: "yellow", points: 100, check: (d: any) => d.revenue >= 10000 },
      { id: "first_50k_revenue", name: "Revenue Champion", description: "Generated $50,000 in revenue", icon: "trophy", color: "gold", points: 300, check: (d: any) => d.revenue >= 50000 },
      { id: "first_10k_commission", name: "Commission Milestone", description: "Earned $10,000 in commissions", icon: "gem", color: "cyan", points: 150, check: (d: any) => d.totalPaidOut >= 10000 },
      { id: "silver_tier", name: "Silver Status", description: "Reached Silver tier", icon: "medal-silver", color: "silver", points: 100, check: (d: any) => d.tier === "silver" || d.tier === "gold" },
      { id: "gold_tier", name: "Gold Status", description: "Reached Gold tier", icon: "medal-gold", color: "gold", points: 250, check: (d: any) => d.tier === "gold" },
    ];

    const { data: agent } = await db.from("agents").select("*").eq("id", agent_id).single();
    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    const { data: existingAchievements } = await db
      .from("agent_achievements")
      .select("achievement_id")
      .eq("agent_id", agent_id);

    const earnedIds = (existingAchievements ?? []).map((a: any) => a.achievement_id);

    const agentData = {
      players: agent.referred_players_count || 0,
      revenue: agent.total_revenue_generated || 0,
      totalPaidOut: agent.total_paid_out || 0,
      tier: agent.tier || "bronze",
    };

    const newAchievements: any[] = [];
    for (const achievement of ACHIEVEMENTS) {
      if (!earnedIds.includes(achievement.id) && achievement.check(agentData)) {
        await db.from("agent_achievements").insert({
          agent_id,
          achievement_id: achievement.id,
          achievement_name: achievement.name,
          achievement_description: achievement.description,
          badge_icon: achievement.icon,
          badge_color: achievement.color,
          earned_date: new Date().toISOString().split("T")[0],
          points: achievement.points,
        });
        newAchievements.push(achievement);
      }
    }

    return Response.json({
      success: true,
      new_achievements: newAchievements.length,
      achievements: newAchievements,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
