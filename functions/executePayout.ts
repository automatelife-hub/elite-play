import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Execute Payout - Processes a specific payout batch through payment gateway
 * Called manually by admin or automatically after batch approval
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { batch_id } = await req.json();

    if (!batch_id) {
      return Response.json({ error: 'Missing batch_id' }, { status: 400 });
    }

    // Get the payout batch
    const batches = await base44.asServiceRole.entities.PayoutBatch.filter({ id: batch_id });
    if (batches.length === 0) {
      return Response.json({ error: 'Batch not found' }, { status: 404 });
    }

    const batch = batches[0];

    // Check if already processed
    if (batch.status === 'completed') {
      return Response.json({ error: 'Batch already completed' }, { status: 400 });
    }

    if (batch.status !== 'approved') {
      return Response.json({ error: 'Batch must be approved before processing' }, { status: 400 });
    }

    // Update batch to processing
    await base44.asServiceRole.entities.PayoutBatch.update(batch_id, {
      status: 'processing'
    });

    // Get agent info
    const agents = await base44.asServiceRole.entities.Agent.filter({ id: batch.agent_id });
    const agent = agents[0];

    // Call mock payment gateway
    const paymentResponse = await base44.asServiceRole.functions.invoke('mockPaymentGateway', {
      amount: batch.total_amount,
      agent_id: batch.agent_id,
      payment_method: batch.payment_method
    });

    if (paymentResponse.success) {
      // Payment successful - update batch
      await base44.asServiceRole.entities.PayoutBatch.update(batch_id, {
        status: 'completed',
        transaction_id: paymentResponse.transaction_id,
        processed_date: new Date().toISOString().split('T')[0]
      });

      // Update all commissions in batch to completed
      await Promise.all(batch.commission_ids.map(commissionId =>
        base44.asServiceRole.entities.AgentCommission.update(commissionId, {
          payout_status: 'completed',
          payout_date: new Date().toISOString().split('T')[0],
          transaction_id: paymentResponse.transaction_id
        })
      ));

      // Update agent's total paid out and last payout date
      await base44.asServiceRole.entities.Agent.update(batch.agent_id, {
        total_paid_out: (agent.total_paid_out || 0) + batch.total_amount,
        last_payout_date: new Date().toISOString().split('T')[0]
      });

      // Send notification email to agent
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: agent.agent_email,
          subject: 'Commission Payout Processed Successfully',
          body: `
Dear ${agent.agent_name},

Your commission payout has been processed successfully!

Amount: $${batch.total_amount.toFixed(2)}
Transaction ID: ${paymentResponse.transaction_id}
Payment Method: ${batch.payment_method}
Date: ${new Date().toLocaleDateString()}

The funds should appear in your account within 2-5 business days.

Best regards,
AceRakeback Team
          `
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }

      return Response.json({
        success: true,
        message: 'Payout processed successfully',
        transaction_id: paymentResponse.transaction_id,
        amount: batch.total_amount
      });

    } else {
      // Payment failed - update batch
      await base44.asServiceRole.entities.PayoutBatch.update(batch_id, {
        status: 'failed',
        notes: paymentResponse.error || 'Payment gateway error'
      });

      // Update commissions back to pending
      await Promise.all(batch.commission_ids.map(commissionId =>
        base44.asServiceRole.entities.AgentCommission.update(commissionId, {
          payout_status: 'pending'
        })
      ));

      return Response.json({
        success: false,
        error: paymentResponse.error || 'Payment processing failed',
        batch_id: batch_id
      }, { status: 500 });
    }

  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});