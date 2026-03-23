import { createServiceClient, getAuthUser } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const user = await getAuthUser(req, db);

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { batch_id } = await req.json();
    if (!batch_id) {
      return Response.json({ error: "Missing batch_id" }, { status: 400 });
    }

    const { data: batch } = await db.from("payout_batches").select("*").eq("id", batch_id).single();
    if (!batch) {
      return Response.json({ error: "Batch not found" }, { status: 404 });
    }
    if (batch.status === "completed") {
      return Response.json({ error: "Batch already completed" }, { status: 400 });
    }
    if (batch.status !== "approved") {
      return Response.json({ error: "Batch must be approved before processing" }, { status: 400 });
    }

    await db.from("payout_batches").update({ status: "processing" }).eq("id", batch_id);

    const { data: agent } = await db.from("agents").select("*").eq("id", batch.agent_id).single();

    // Call mock payment gateway edge function
    const gatewayUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/mockPaymentGateway`;
    const gatewayRes = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") || "",
      },
      body: JSON.stringify({
        amount: batch.total_amount,
        agent_id: batch.agent_id,
        payment_method: batch.payment_method,
      }),
    });
    const paymentResponse = await gatewayRes.json();

    if (paymentResponse.success) {
      await db.from("payout_batches").update({
        status: "completed",
        transaction_id: paymentResponse.transaction_id,
        processed_date: new Date().toISOString().split("T")[0],
      }).eq("id", batch_id);

      for (const commissionId of batch.commission_ids ?? []) {
        await db.from("agent_commissions").update({
          payout_status: "completed",
          payout_date: new Date().toISOString().split("T")[0],
          transaction_id: paymentResponse.transaction_id,
        }).eq("id", commissionId);
      }

      await db.from("agents").update({
        total_paid_out: (agent?.total_paid_out || 0) + batch.total_amount,
        last_payout_date: new Date().toISOString().split("T")[0],
      }).eq("id", batch.agent_id);

      // TODO: Send email notification via Resend or similar service

      return Response.json({
        success: true,
        message: "Payout processed successfully",
        transaction_id: paymentResponse.transaction_id,
        amount: batch.total_amount,
      });
    } else {
      await db.from("payout_batches").update({
        status: "failed",
        notes: paymentResponse.error || "Payment gateway error",
      }).eq("id", batch_id);

      for (const commissionId of batch.commission_ids ?? []) {
        await db.from("agent_commissions").update({ payout_status: "pending" }).eq("id", commissionId);
      }

      return Response.json({
        success: false,
        error: paymentResponse.error || "Payment processing failed",
        batch_id,
      }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
