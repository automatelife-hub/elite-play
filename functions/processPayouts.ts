import { createServiceClient, getAuthUser } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const user = await getAuthUser(req, db);

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const MINIMUM_PAYOUT = 100;
    const results = { batches_created: 0, total_amount: 0, agents_processed: [] as any[], errors: [] as any[] };

    const { data: allAgents } = await db
      .from("agents")
      .select("*")
      .eq("status", "approved")
      .eq("payment_type", "automated");

    const { data: pendingCommissions } = await db
      .from("agent_commissions")
      .select("*")
      .eq("payout_status", "pending");

    const commissionsByAgent: Record<string, any[]> = {};
    (pendingCommissions ?? []).forEach((c: any) => {
      if (!commissionsByAgent[c.agent_id]) commissionsByAgent[c.agent_id] = [];
      commissionsByAgent[c.agent_id].push(c);
    });

    for (const agent of allAgents ?? []) {
      try {
        const agentCommissions = commissionsByAgent[agent.id] || [];
        if (!agentCommissions.length) continue;

        const totalPending = agentCommissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
        if (totalPending < MINIMUM_PAYOUT) continue;

        const { data: batch } = await db.from("payout_batches").insert({
          agent_id: agent.id,
          batch_date: new Date().toISOString().split("T")[0],
          total_amount: totalPending,
          commission_ids: agentCommissions.map((c) => c.id),
          status: "approved",
          approved_by: "system_auto",
          payment_method: agent.payment_method || "bank_transfer",
        }).select().single();

        for (const commission of agentCommissions) {
          await db.from("agent_commissions").update({ payout_status: "processing" }).eq("id", commission.id);
        }

        results.batches_created++;
        results.total_amount += totalPending;
        results.agents_processed.push({
          agent_id: agent.id,
          agent_name: agent.agent_name,
          amount: totalPending,
          batch_id: batch?.id,
        });
      } catch (error: any) {
        results.errors.push({ agent_id: agent.id, error: error.message });
      }
    }

    return Response.json({
      success: true,
      summary: results,
      message: `Created ${results.batches_created} payout batches totaling $${results.total_amount.toFixed(2)}`,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
