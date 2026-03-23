import React, { useState, useEffect } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trophy, TrendingUp, Ticket, Calendar, Users } from "lucide-react";
import CreateContestDialog from "../components/contests/CreateContestDialog";
import ContestLeaderboard from "../components/contests/ContestLeaderboard";

export default function AgentContests() {
  const [user, setUser] = useState(null);
  const [contests, setContests] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);

      if (!currentUser.is_agent && currentUser.role !== 'admin') {
        setLoading(false);
        return;
      }

      const [agentContests, allSites] = await Promise.all([
        currentUser.agent_id 
          ? db.entities.AgentContest.filter({ agent_id: currentUser.agent_id })
          : [],
        db.entities.Site.list()
      ]);

      setContests(agentContests);
      setSites(allSites);
    } catch (error) {
      console.error("Error loading contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getContestIcon = (type) => {
    switch (type) {
      case 'rake_race': return TrendingUp;
      case 'wagering_contest': return Trophy;
      case 'raffle': return Ticket;
      default: return Trophy;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const activeContests = contests.filter(c => c.status === 'active');
  const upcomingContests = contests.filter(c => c.status === 'upcoming');
  const completedContests = contests.filter(c => c.status === 'completed');

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user?.is_agent && user?.role !== 'admin') {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">Contest management is only available to approved agents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Contests</h1>
            <p className="text-gray-400">Create and manage player contests</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Contest
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Contests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{activeContests.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{upcomingContests.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-400">{completedContests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Contest List */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid gap-4">
              {activeContests.map(contest => {
                const ContestIcon = getContestIcon(contest.contest_type);
                const site = sites.find(s => s.id === contest.site_id);
                
                return (
                  <Card key={contest.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 cursor-pointer" onClick={() => setSelectedContest(contest)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <ContestIcon className="w-6 h-6 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-1">{contest.contest_name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{site?.name}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(contest.start_date).toLocaleDateString()} - {new Date(contest.end_date).toLocaleDateString()}
                              </span>
                              <span className="capitalize">{contest.contest_type.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(contest.status)}>
                          {contest.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {activeContests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No active contests</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="grid gap-4">
              {upcomingContests.map(contest => {
                const ContestIcon = getContestIcon(contest.contest_type);
                const site = sites.find(s => s.id === contest.site_id);
                
                return (
                  <Card key={contest.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <ContestIcon className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-1">{contest.contest_name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{site?.name}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Starts {new Date(contest.start_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(contest.status)}>
                          {contest.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {upcomingContests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No upcoming contests</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-4">
              {completedContests.map(contest => {
                const ContestIcon = getContestIcon(contest.contest_type);
                const site = sites.find(s => s.id === contest.site_id);
                
                return (
                  <Card key={contest.id} className="bg-gray-900 border-gray-800 cursor-pointer" onClick={() => setSelectedContest(contest)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                            <ContestIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-1">{contest.contest_name}</h3>
                            <p className="text-sm text-gray-400 mb-2">{site?.name}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Ended {new Date(contest.end_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(contest.status)}>
                          {contest.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {completedContests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No completed contests</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateContestDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        sites={sites}
        agentId={user?.agent_id}
        onContestCreated={loadData}
      />

      {selectedContest && (
        <ContestLeaderboard
          contest={selectedContest}
          onClose={() => setSelectedContest(null)}
        />
      )}
    </div>
  );
}