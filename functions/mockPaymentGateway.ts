import { createServiceClient, getAuthUser } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const user = await getAuthUser(req, db);

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { amount, agent_id, payment_method } = await req.json();
    if (!amount || !agent_id) {
      return Response.json({ error: "Missing required fields: amount, agent_id" }, { status: 400 });
    }

    // Simulate processing delay (500ms - 2s)
    const delay = Math.floor(Math.random() * 1500) + 500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 90% success rate for simulation
    if (Math.random() < 0.9) {
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      return Response.json({
        success: true,
        transaction_id: transactionId,
        amount,
        agent_id,
        payment_method: payment_method || "bank_transfer",
        processed_at: new Date().toISOString(),
        message: "Payment processed successfully",
      });
    } else {
      const reasons = [
        "Insufficient funds in merchant account",
        "Invalid payment details",
        "Payment gateway timeout",
        "Bank declined transaction",
      ];
      return Response.json({
        success: false,
        error: reasons[Math.floor(Math.random() * reasons.length)],
        amount,
        agent_id,
        processed_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
