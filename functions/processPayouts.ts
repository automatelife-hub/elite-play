import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Automated Payout Processing Function
 * This function should be scheduled to run automatically (e.g., daily/weekly)
 * It processes eligible agent commissions and creates payout batches
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only admins can trigger payout processing
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const MINIMUM_PAYOUT = 100; // Minimum amount required for payout
    const results = {
      batches_created: 0,
      total_amount: 0,
      agents_processed: [],
      errors: []
    };

    // Get all agents with automated payment type
    const allAgents = await base44.asServiceRole.entities.Agent.filter({ 
      status: 'approved',
      payment_type: 'automated'
    });

    // Get all pending commissions
    const pendingCommissions = await base44.asServiceRole.entities.AgentCommission.filter({
      payout_status: 'pending'
    });

    // Group commissions by agent
    const commissionsByAgent = {};
    pendingCommissions.forEach(commission => {
      if (!commissionsByAgent[commission.agent_id]) {
        commissionsByAgent[commission.agent_id] = [];
      }
      commissionsByAgent[commission.agent_id].push(commission);
    });

    // Process each agent
    for (const agent of allAgents) {
      try {
        const agentCommissions = commissionsByAgent[agent.id] || [];
        
        if (agentCommissions.length === 0) continue;

        // Calculate total pending amount
        const totalPending = agentCommissions.reduce(
          (sum, c) => sum + (c.commission_amount || 0), 
          0
        );

        // Check if meets minimum threshold
        if (totalPending < MINIMUM_PAYOUT) {
          continue;
        }

        // Create payout batch
        const batch = await base44.asServiceRole.entities.PayoutBatch.create({
          agent_id: agent.id,
          batch_date: new Date().toISOString().split('T')[0],
          total_amount: totalPending,
          commission_ids: agentCommissions.map(c => c.id),
          status: 'approved', // Auto-approve for automated payments
          approved_by: 'system_auto',
          payment_method: agent.payment_method || 'bank_transfer'
        });

        // Update commission statuses to processing
        await Promise.all(agentCommissions.map(commission =>
          base44.asServiceRole.entities.AgentCommission.update(commission.id, {
            payout_status: 'processing'
          })
        ));

        results.batches_created++;
        results.total_amount += totalPending;
        results.agents_processed.push({
          agent_id: agent.id,
          agent_name: agent.agent_name,
          amount: totalPending,
          batch_id: batch.id
        });

      } catch (error) {
        results.errors.push({
          agent_id: agent.id,
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      summary: results,
      message: `Created ${results.batches_created} payout batches totaling $${results.total_amount.toFixed(2)}`
    });

  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});