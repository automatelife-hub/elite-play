import { createServiceClient } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const { referral_code, new_agent_email } = await req.json();

    if (!referral_code || !new_agent_email) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: referrers } = await db
      .from("agents")
      .select("*")
      .eq("agent_referral_code", referral_code);

    if (!referrers?.length) {
      return Response.json({ error: "Invalid referral code" }, { status: 404 });
    }

    const referrer = referrers[0];

    const { data: existingAgents } = await db
      .from("agents")
      .select("*")
      .eq("agent_email", new_agent_email);

    if (existingAgents?.length) {
      const existing = existingAgents[0];
      if (!existing.referrer_agent_id) {
        await db.from("agents").update({ referrer_agent_id: referrer.id }).eq("id", existing.id);
        await db.from("agent_referrals").insert({
          referrer_agent_id: referrer.id,
          referred_agent_id: existing.id,
          referral_code,
          status: existing.status === "approved" ? "active" : "pending",
          referral_date: new Date().toISOString().split("T")[0],
        });
        return Response.json({ success: true, message: "Agent referral tracked successfully" });
      }
      return Response.json({ error: "Agent already has a referrer" }, { status: 400 });
    }

    return Response.json({
      success: true,
      message: "Referral code stored for new agent registration",
      referrer_agent_id: referrer.id,
    });
  } catch (error) {
    console.error("Error processing agent referral:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
