import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Mock Payment Gateway - Simulates payment processing for testing
 * Returns success/failure randomly with realistic delays
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only admins can trigger payments
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { amount, agent_id, payment_method } = await req.json();

    if (!amount || !agent_id) {
      return Response.json({ 
        error: 'Missing required fields: amount, agent_id' 
      }, { status: 400 });
    }

    // Simulate processing delay (500ms - 2s)
    const delay = Math.floor(Math.random() * 1500) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // 90% success rate for simulation
    const success = Math.random() < 0.9;

    if (success) {
      // Generate mock transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      return Response.json({
        success: true,
        transaction_id: transactionId,
        amount: amount,
        agent_id: agent_id,
        payment_method: payment_method || 'bank_transfer',
        processed_at: new Date().toISOString(),
        message: 'Payment processed successfully'
      });
    } else {
      // Simulate failure scenarios
      const failureReasons = [
        'Insufficient funds in merchant account',
        'Invalid payment details',
        'Payment gateway timeout',
        'Bank declined transaction'
      ];
      const reason = failureReasons[Math.floor(Math.random() * failureReasons.length)];

      return Response.json({
        success: false,
        error: reason,
        amount: amount,
        agent_id: agent_id,
        processed_at: new Date().toISOString()
      });
    }
  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});