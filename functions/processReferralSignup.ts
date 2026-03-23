import { createServiceClient } from "./_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    const db = createServiceClient();
    const { referral_code, site_id, player_username, player_email, platform } = await req.json();

    if (!referral_code || !site_id || !player_username || !platform) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [{ data: referralLinks }, { data: agents }] = await Promise.all([
      db.from("agent_referral_links").select("*").eq("referral_code", referral_code),
      db.from("agents").select("*").eq("tracking_code", referral_code),
    ]);

    let agentId: string | null = null;

    if (referralLinks?.length) {
      agentId = referralLinks[0].agent_id;
      await db.from("agent_referral_links").update({
        conversions: (referralLinks[0].conversions || 0) + 1,
      }).eq("id", referralLinks[0].id);
    } else if (agents?.length) {
      agentId = agents[0].id;
    }

    if (!agentId) {
      return Response.json({ error: "Invalid referral code" }, { status: 404 });
    }

    const { data: player } = await db.from("agent_players").insert({
      agent_id: agentId,
      site_id,
      player_username,
      player_email: player_email || null,
      platform,
      status: "pending",
      signup_date: new Date().toISOString().split("T")[0],
      referral_code,
    }).select().single();

    const { data: agent } = await db.from("agents").select("referred_players_count").eq("id", agentId).single();
    if (agent) {
      await db.from("agents").update({
        referred_players_count: (agent.referred_players_count || 0) + 1,
      }).eq("id", agentId);
    }

    return Response.json({
      success: true,
      player_id: player?.id,
      message: "Player signup tracked successfully",
    });
  } catch (error) {
    console.error("Error processing referral signup:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
