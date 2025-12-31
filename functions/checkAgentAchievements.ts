import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Check and award agent achievements based on their performance
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || (!user.is_agent && user.role !== 'admin')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { agent_id } = await req.json();
    if (!agent_id) {
      return Response.json({ error: 'Missing agent_id' }, { status: 400 });
    }

    // Define achievements
    const ACHIEVEMENTS = [
      {
        id: 'first_player',
        name: 'First Steps',
        description: 'Referred your first player',
        icon: '🎯',
        color: 'blue',
        points: 10,
        check: (data) => data.players >= 1
      },
      {
        id: 'ten_players',
        name: 'Growing Network',
        description: 'Referred 10 players',
        icon: '👥',
        color: 'green',
        points: 50,
        check: (data) => data.players >= 10
      },
      {
        id: 'fifty_players',
        name: 'Agent Elite',
        description: 'Referred 50 players',
        icon: '⭐',
        color: 'purple',
        points: 200,
        check: (data) => data.players >= 50
      },
      {
        id: 'hundred_players',
        name: 'Master Recruiter',
        description: 'Referred 100 players',
        icon: '👑',
        color: 'gold',
        points: 500,
        check: (data) => data.players >= 100
      },
      {
        id: 'first_1k_revenue',
        name: 'First $1,000',
        description: 'Generated $1,000 in revenue',
        icon: '💵',
        color: 'green',
        points: 25,
        check: (data) => data.revenue >= 1000
      },
      {
        id: 'first_10k_revenue',
        name: '$10K Club',
        description: 'Generated $10,000 in revenue',
        icon: '💰',
        color: 'yellow',
        points: 100,
        check: (data) => data.revenue >= 10000
      },
      {
        id: 'first_50k_revenue',
        name: 'Revenue Champion',
        description: 'Generated $50,000 in revenue',
        icon: '🏆',
        color: 'gold',
        points: 300,
        check: (data) => data.revenue >= 50000
      },
      {
        id: 'first_10k_commission',
        name: 'Commission Milestone',
        description: 'Earned $10,000 in commissions',
        icon: '💎',
        color: 'cyan',
        points: 150,
        check: (data) => data.totalPaidOut >= 10000
      },
      {
        id: 'silver_tier',
        name: 'Silver Status',
        description: 'Reached Silver tier',
        icon: '🥈',
        color: 'silver',
        points: 100,
        check: (data) => data.tier === 'silver' || data.tier === 'gold'
      },
      {
        id: 'gold_tier',
        name: 'Gold Status',
        description: 'Reached Gold tier',
        icon: '🥇',
        color: 'gold',
        points: 250,
        check: (data) => data.tier === 'gold'
      }
    ];

    // Get agent data
    const agents = await base44.asServiceRole.entities.Agent.filter({ id: agent_id });
    if (agents.length === 0) {
      return Response.json({ error: 'Agent not found' }, { status: 404 });
    }
    const agent = agents[0];

    // Get existing achievements
    const existingAchievements = await base44.asServiceRole.entities.AgentAchievement.filter({ agent_id });
    const earnedIds = existingAchievements.map(a => a.achievement_id);

    // Prepare agent data for checks
    const agentData = {
      players: agent.referred_players_count || 0,
      revenue: agent.total_revenue_generated || 0,
      totalPaidOut: agent.total_paid_out || 0,
      tier: agent.tier || 'bronze'
    };

    // Check and award new achievements
    const newAchievements = [];
    for (const achievement of ACHIEVEMENTS) {
      if (!earnedIds.includes(achievement.id) && achievement.check(agentData)) {
        await base44.asServiceRole.entities.AgentAchievement.create({
          agent_id: agent_id,
          achievement_id: achievement.id,
          achievement_name: achievement.name,
          achievement_description: achievement.description,
          badge_icon: achievement.icon,
          badge_color: achievement.color,
          earned_date: new Date().toISOString().split('T')[0],
          points: achievement.points
        });
        newAchievements.push(achievement);
      }
    }

    return Response.json({
      success: true,
      new_achievements: newAchievements.length,
      achievements: newAchievements
    });

  } catch (error) {
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
});