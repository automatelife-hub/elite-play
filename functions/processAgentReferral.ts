import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { referral_code, new_agent_email } = await req.json();

    if (!referral_code || !new_agent_email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find the referring agent
    const referrers = await base44.asServiceRole.entities.Agent.filter({ 
      agent_referral_code: referral_code 
    });

    if (referrers.length === 0) {
      return Response.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    const referrer = referrers[0];

    // Check if agent already exists
    const existingAgents = await base44.asServiceRole.entities.Agent.filter({ 
      agent_email: new_agent_email 
    });

    if (existingAgents.length > 0) {
      // Update existing agent with referrer if they don't have one
      const existingAgent = existingAgents[0];
      if (!existingAgent.referrer_agent_id) {
        await base44.asServiceRole.entities.Agent.update(existingAgent.id, {
          referrer_agent_id: referrer.id
        });

        // Create referral tracking record
        await base44.asServiceRole.entities.AgentReferral.create({
          referrer_agent_id: referrer.id,
          referred_agent_id: existingAgent.id,
          referral_code,
          status: existingAgent.status === 'approved' ? 'active' : 'pending',
          referral_date: new Date().toISOString().split('T')[0]
        });

        return Response.json({ 
          success: true, 
          message: 'Agent referral tracked successfully' 
        });
      } else {
        return Response.json({ 
          error: 'Agent already has a referrer' 
        }, { status: 400 });
      }
    }

    // Store referral code in session/cookie for later use when agent registers
    return Response.json({ 
      success: true,
      message: 'Referral code stored for new agent registration',
      referrer_agent_id: referrer.id
    });
  } catch (error) {
    console.error('Error processing agent referral:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});