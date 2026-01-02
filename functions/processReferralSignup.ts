import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { referral_code, site_id, player_username, player_email, platform } = await req.json();

    if (!referral_code || !site_id || !player_username || !platform) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the referral link by tracking code or referral code
    const [referralLinks, agents] = await Promise.all([
      base44.asServiceRole.entities.AgentReferralLink.filter({ referral_code }),
      base44.asServiceRole.entities.Agent.filter({ tracking_code: referral_code })
    ]);

    let agentId = null;

    if (referralLinks.length > 0) {
      agentId = referralLinks[0].agent_id;
      // Update click to conversion
      await base44.asServiceRole.entities.AgentReferralLink.update(referralLinks[0].id, {
        conversions: (referralLinks[0].conversions || 0) + 1
      });
    } else if (agents.length > 0) {
      agentId = agents[0].id;
    }

    if (!agentId) {
      return Response.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // Create the player record with pending status
    const player = await base44.asServiceRole.entities.AgentPlayer.create({
      agent_id: agentId,
      site_id,
      player_username,
      player_email: player_email || null,
      platform,
      status: 'pending',
      signup_date: new Date().toISOString().split('T')[0],
      referral_code
    });

    // Update agent player count
    const agent = await base44.asServiceRole.entities.Agent.filter({ id: agentId });
    if (agent.length > 0) {
      await base44.asServiceRole.entities.Agent.update(agentId, {
        referred_players_count: (agent[0].referred_players_count || 0) + 1
      });
    }

    return Response.json({ 
      success: true, 
      player_id: player.id,
      message: 'Player signup tracked successfully'
    });
  } catch (error) {
    console.error('Error processing referral signup:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});