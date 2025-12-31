import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Ticket } from "lucide-react";

export default function ContestLeaderboard({ contest, onClose }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipants();
  }, [contest]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.ContestParticipant.filter({ contest_id: contest.id });
      
      // Sort by points/raffle tickets
      const sorted = data.sort((a, b) => {
        if (contest.contest_type === 'raffle') {
          return (b.raffle_tickets || 0) - (a.raffle_tickets || 0);
        }
        return (b.points || 0) - (a.points || 0);
      });

      setParticipants(sorted);
    } catch (error) {
      console.error("Error loading participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-br from-orange-600 to-orange-800";
    return "bg-gray-700";
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getContestIcon = () => {
    switch (contest.contest_type) {
      case 'rake_race': return TrendingUp;
      case 'wagering_contest': return Trophy;
      case 'raffle': return Ticket;
      default: return Trophy;
    }
  };

  const ContestIcon = getContestIcon();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <ContestIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{contest.contest_name}</DialogTitle>
              <p className="text-sm text-gray-400 capitalize">{contest.contest_type.replace('_', ' ')}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Contest Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Period:</span>
                  <div className="text-white font-medium">
                    {new Date(contest.start_date).toLocaleDateString()} - {new Date(contest.end_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Prize Pool:</span>
                  <div className="text-white font-medium">{contest.prize_pool}</div>
                </div>
              </div>
              {contest.rules && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <span className="text-gray-400 text-sm">Rules:</span>
                  <p className="text-white text-sm mt-1">{contest.rules}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
              </div>
            ) : participants.length > 0 ? (
              <div className="space-y-2">
                {participants.map((participant, idx) => {
                  const rank = idx + 1;
                  return (
                    <Card key={participant.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full ${getMedalColor(rank)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                            {rank <= 3 ? (
                              <span className="text-xl">{getMedalIcon(rank)}</span>
                            ) : (
                              <span className="text-sm">{rank}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{participant.player_username}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                              {contest.contest_type === 'raffle' ? (
                                <>
                                  <span>{participant.raffle_tickets || 0} tickets</span>
                                  {participant.total_rake > 0 && (
                                    <span>• ${participant.total_rake.toFixed(2)} rake</span>
                                  )}
                                  {participant.total_wagered > 0 && (
                                    <span>• ${participant.total_wagered.toFixed(2)} wagered</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="text-white font-semibold">{participant.points || 0} points</span>
                                  {participant.total_rake > 0 && (
                                    <span>• ${participant.total_rake.toFixed(2)} rake</span>
                                  )}
                                  {participant.total_wagered > 0 && (
                                    <span>• ${participant.total_wagered.toFixed(2)} wagered</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No participants yet</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}