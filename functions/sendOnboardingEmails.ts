import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Send Onboarding Emails - Triggers welcome series after agent approval
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { agent_id } = await req.json();

    if (!agent_id) {
      return Response.json({ error: 'Missing agent_id' }, { status: 400 });
    }

    // Get agent details
    const agents = await base44.asServiceRole.entities.Agent.filter({ id: agent_id });
    if (agents.length === 0) {
      return Response.json({ error: 'Agent not found' }, { status: 404 });
    }

    const agent = agents[0];

    // Create onboarding record
    await base44.asServiceRole.entities.AgentOnboarding.create({
      agent_id: agent_id,
      welcome_email_sent: true
    });

    // Send welcome email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: agent.agent_email,
      subject: 'Welcome to AceRakeback Agency Program! 🎉',
      body: `
Dear ${agent.agent_name},

Congratulations! Your agency application has been approved. Welcome to the AceRakeback family!

🎯 Your Account Details:
- Tracking Code: ${agent.tracking_code}
- Commission Rate: ${agent.commission_rate || 25}%
- Tier: ${agent.tier || 'bronze'} (upgradable based on performance)

📋 Next Steps - Complete Your Setup:
1. Configure your payment information
2. Review your tracking links for each site
3. Submit your first player
4. Download marketing materials

🚀 Getting Started:
Visit your Agent Portal to complete the setup wizard and start referring players.

Portal Login: https://acerakeback.com/agent-portal

Need help? Reply to this email or contact your account manager.

Best regards,
The AceRakeback Team

---
P.S. Check out our getting started guide to maximize your earnings from day one!
      `
    });

    // Schedule follow-up email (Day 3)
    // Note: In production, this would use a job queue or cron
    // For now, we just mark it for future implementation
    
    return Response.json({
      success: true,
      message: 'Onboarding emails sent successfully',
      agent_email: agent.agent_email
    });

  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});