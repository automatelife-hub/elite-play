import { createServiceClient, getAuthUser } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const user = await getAuthUser(req, db);

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { data: referrals } = await db
      .from("agent_referrals")
      .select("*")
      .eq("status", "active");

    const commissionsCreated: any[] = [];

    for (const referral of referrals ?? []) {
      const [{ data: referredAgents }, { data: referredPlayers }] = await Promise.all([
        db.from("agents").select("*").eq("id", referral.referred_agent_id),
        db.from("agent_players").select("*").eq("agent_id", referral.referred_agent_id),
      ]);

      if (!referredAgents?.length) continue;
      const referredAgent = referredAgents[0];
      const totalRevenue = (referredPlayers ?? []).reduce(
        (sum: number, p: any) => sum + (p.total_revenue || 0), 0
      );

      const commissionAmount = (totalRevenue * referral.commission_rate) / 100;

      await db.from("agent_referrals").update({
        total_revenue_generated: totalRevenue,
        total_commission_earned: (referral.total_commission_earned || 0) + commissionAmount,
      }).eq("id", referral.id);

      if (commissionAmount > 0) {
        const { data: commission } = await db.from("agent_commissions").insert({
          agent_id: referral.referrer_agent_id,
          player_id: null,
          site_id: null,
          period_start: new Date().toISOString().split("T")[0],
          period_end: new Date().toISOString().split("T")[0],
          revenue_generated: totalRevenue,
          commission_rate: referral.commission_rate,
          commission_amount: commissionAmount,
          payout_status: "pending",
          notes: `Agent referral commission from ${referredAgent.agent_name}`,
        }).select().single();
        if (commission) commissionsCreated.push(commission);
      }
    }

    return Response.json({
      success: true,
      referrals_processed: referrals?.length || 0,
      commissions_created: commissionsCreated.length,
    });
  } catch (error) {
    console.error("Error calculating referral commissions:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
