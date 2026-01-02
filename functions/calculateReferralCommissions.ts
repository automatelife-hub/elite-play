import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Admin only
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all active agent referrals
    const referrals = await base44.asServiceRole.entities.AgentReferral.filter({ 
      status: 'active' 
    });

    const commissionsCreated = [];

    for (const referral of referrals) {
      // Get referred agent's data
      const [referredAgents, referredAgentPlayers] = await Promise.all([
        base44.asServiceRole.entities.Agent.filter({ id: referral.referred_agent_id }),
        base44.asServiceRole.entities.AgentPlayer.filter({ agent_id: referral.referred_agent_id })
      ]);

      if (referredAgents.length === 0) continue;

      const referredAgent = referredAgents[0];
      const totalRevenue = referredAgentPlayers.reduce(
        (sum, p) => sum + (p.total_revenue || 0), 
        0
      );

      // Calculate commission (10% of referred agent's revenue)
      const commissionAmount = (totalRevenue * referral.commission_rate) / 100;

      // Update referral tracking
      await base44.asServiceRole.entities.AgentReferral.update(referral.id, {
        total_revenue_generated: totalRevenue,
        total_commission_earned: (referral.total_commission_earned || 0) + commissionAmount
      });

      // Create commission record for referrer
      if (commissionAmount > 0) {
        const commission = await base44.asServiceRole.entities.AgentCommission.create({
          agent_id: referral.referrer_agent_id,
          player_id: null, // This is agent referral commission
          site_id: null,
          period_start: new Date().toISOString().split('T')[0],
          period_end: new Date().toISOString().split('T')[0],
          revenue_generated: totalRevenue,
          commission_rate: referral.commission_rate,
          commission_amount: commissionAmount,
          payout_status: 'pending',
          notes: `Agent referral commission from ${referredAgent.agent_name}`
        });

        commissionsCreated.push(commission);
      }
    }

    return Response.json({
      success: true,
      referrals_processed: referrals.length,
      commissions_created: commissionsCreated.length
    });
  } catch (error) {
    console.error('Error calculating referral commissions:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});