import { createServiceClient, getAuthUser } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const user = await getAuthUser(req, db);

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { agent_id, period_start, period_end } = await req.json();

    if (!agent_id || !period_start || !period_end) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [{ data: agents }, { data: agentDeals }, { data: players }] = await Promise.all([
      db.from("agents").select("*").eq("id", agent_id),
      db.from("agent_deals").select("*").eq("agent_id", agent_id).eq("status", "approved"),
      db.from("agent_players").select("*").eq("agent_id", agent_id),
    ]);

    if (!agents?.length) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    const agent = agents[0];
    const commissionsCreated: any[] = [];

    for (const player of players ?? []) {
      if (player.status !== "active" && player.status !== "approved") continue;
      const deal = agentDeals?.find((d: any) => d.site_id === player.site_id);
      if (!deal) continue;

      const revenueGenerated = player.monthly_revenue || 0;
      const commissionAmount = (revenueGenerated * deal.commission_rate) / 100;

      if (commissionAmount > 0) {
        const { data: commission } = await db.from("agent_commissions").insert({
          agent_id,
          player_id: player.id,
          site_id: player.site_id,
          period_start,
          period_end,
          revenue_generated: revenueGenerated,
          commission_rate: deal.commission_rate,
          commission_amount: commissionAmount,
          payout_status: "pending",
        }).select().single();
        if (commission) commissionsCreated.push(commission);
      }
    }

    const totalCommission = commissionsCreated.reduce((sum, c) => sum + c.commission_amount, 0);
    let payoutBatch = null;

    if (totalCommission >= 100) {
      const { data } = await db.from("payout_batches").insert({
        agent_id,
        batch_date: new Date().toISOString().split("T")[0],
        total_amount: totalCommission,
        commission_ids: commissionsCreated.map((c) => c.id),
        status: agent.payment_type === "automated" ? "approved" : "pending_approval",
        payment_method: agent.payment_method,
      }).select().single();
      payoutBatch = data;
    }

    return Response.json({
      success: true,
      commissionsCreated: commissionsCreated.length,
      totalCommission,
      payoutBatch: payoutBatch?.id || null,
    });
  } catch (error) {
    console.error("Error calculating commissions:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
