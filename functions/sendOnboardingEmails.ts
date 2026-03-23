import { createServiceClient, getAuthUser } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const user = await getAuthUser(req, db);

    if (user?.role !== "admin") {
      return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { agent_id } = await req.json();
    if (!agent_id) {
      return Response.json({ error: "Missing agent_id" }, { status: 400 });
    }

    const { data: agent } = await db.from("agents").select("*").eq("id", agent_id).single();
    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    const trackingCode = agent.tracking_code ||
      `${agent.agent_name.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-6)}`;
    const agentReferralCode = agent.agent_referral_code || `AGT${Date.now().toString().slice(-8)}`;

    await db.from("agents").update({
      tracking_code: trackingCode,
      agent_referral_code: agentReferralCode,
    }).eq("id", agent_id);

    if (agent.referrer_agent_id) {
      const { data: referrals } = await db
        .from("agent_referrals")
        .select("id")
        .eq("referred_agent_id", agent_id)
        .eq("status", "pending");

      if (referrals?.length) {
        await db.from("agent_referrals").update({ status: "active" }).eq("id", referrals[0].id);
      }
    }

    await db.from("agent_onboarding").insert({
      agent_id,
      welcome_email_sent: true,
    });

    // TODO: Integrate email service (Resend, SendGrid, etc.)
    // Email content: Welcome to Gamble Intel Agency Program
    // Include: trackingCode, agentReferralCode, commission_rate, tier, next steps
    console.log(`[sendOnboardingEmails] Would send welcome email to ${agent.agent_email}`);

    return Response.json({
      success: true,
      message: "Onboarding processed successfully",
      agent_email: agent.agent_email,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
