import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Admin only
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { agent_id, period_start, period_end } = await req.json();

    if (!agent_id || !period_start || !period_end) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get agent and their deals
    const [agents, agentDeals, players, sites] = await Promise.all([
      base44.asServiceRole.entities.Agent.filter({ id: agent_id }),
      base44.asServiceRole.entities.AgentDeal.filter({ agent_id, status: 'approved' }),
      base44.asServiceRole.entities.AgentPlayer.filter({ agent_id }),
      base44.asServiceRole.entities.Site.list()
    ]);

    if (agents.length === 0) {
      return Response.json({ error: 'Agent not found' }, { status: 404 });
    }

    const agent = agents[0];
    const commissionsCreated = [];

    // Calculate commission for each player in the period
    for (const player of players) {
      if (player.status !== 'active' && player.status !== 'approved') continue;

      // Find the deal for this player's site
      const deal = agentDeals.find(d => d.site_id === player.site_id);
      if (!deal) continue; // Skip if no approved deal for this site

      // Mock calculation - in production, this would pull actual revenue data
      const revenueGenerated = player.monthly_revenue || 0;
      const commissionAmount = (revenueGenerated * deal.commission_rate) / 100;

      if (commissionAmount > 0) {
        const commission = await base44.asServiceRole.entities.AgentCommission.create({
          agent_id,
          player_id: player.id,
          site_id: player.site_id,
          period_start,
          period_end,
          revenue_generated: revenueGenerated,
          commission_rate: deal.commission_rate,
          commission_amount: commissionAmount,
          payout_status: 'pending'
        });

        commissionsCreated.push(commission);
      }
    }

    // Calculate total commission
    const totalCommission = commissionsCreated.reduce((sum, c) => sum + c.commission_amount, 0);

    // Create payout batch if total exceeds minimum
    let payoutBatch = null;
    if (totalCommission >= 100) {
      payoutBatch = await base44.asServiceRole.entities.PayoutBatch.create({
        agent_id,
        batch_date: new Date().toISOString().split('T')[0],
        total_amount: totalCommission,
        commission_ids: commissionsCreated.map(c => c.id),
        status: agent.payment_type === 'automated' ? 'approved' : 'pending_approval',
        payment_method: agent.payment_method
      });
    }

    return Response.json({
      success: true,
      commissionsCreated: commissionsCreated.length,
      totalCommission,
      payoutBatch: payoutBatch?.id || null
    });
  } catch (error) {
    console.error('Error calculating commissions:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});