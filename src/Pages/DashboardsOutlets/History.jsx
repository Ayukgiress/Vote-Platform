import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Calendar, Users, Loader2, BarChart3, CheckCircle, XCircle, Award } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import API_URL from '../Constants/Constants';

const History = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contestData, setContestData] = useState([]);
  const [stats, setStats] = useState({
    totalContests: 0,
    publishedContests: 0,
    endedContests: 0,
    totalVotes: 0
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token missing");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchContestHistory = async () => {
    try {
      if (!isAuthenticated || !currentUser) {
        console.log("User not authenticated, skipping history fetch");
        return;
      }

      setLoading(true);

      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/contests/all`, { headers });

      if (response.data?.success) {
        const contests = response.data.data || [];
        setContestData(contests);

        // Calculate statistics
        const totalContests = contests.length;
        const publishedContests = contests.filter(c => c.isPublished).length;
        const endedContests = contests.filter(c => c.hasEnded || new Date(c.endDate) < new Date()).length;
        const totalVotes = contests.reduce((sum, contest) => {
          return sum + (contest.contestants?.reduce((contestSum, contestant) => contestSum + (contestant.votes || 0), 0) || 0);
        }, 0);

        setStats({
          totalContests,
          publishedContests,
          endedContests,
          totalVotes
        });
      } else {
        throw new Error(response.data?.error || 'Failed to fetch contest history');
      }
    } catch (error) {
      console.error("Fetch contest history error:", error);
      toast.error("Failed to load contest history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestHistory();
  }, [isAuthenticated, currentUser]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-custom-blue" />
      </div>
    );
  }

  const getContestStatus = (contest) => {
    const now = new Date();
    const endDate = new Date(contest.endDate);
    const startDate = new Date(contest.startDate);

    if (endDate < now) return { status: 'ended', label: 'Ended', color: 'bg-red-100 text-red-800' };
    if (startDate <= now && endDate >= now) return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
    return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
  };

  const getWinners = (contest) => {
    if (!contest.contestants || contest.contestants.length === 0) return [];

    const maxVotes = Math.max(...contest.contestants.map(c => c.votes || 0));
    return contest.contestants.filter(c => (c.votes || 0) === maxVotes);
  };

  const endedContests = contestData.filter(contest => {
    const status = getContestStatus(contest);
    return status.status === 'ended';
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Contest History
        </h1>
        <p className="text-slate-600 mt-2">Review your contest performance and results</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Contests</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalContests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Published</p>
              <p className="text-2xl font-bold text-slate-800">{stats.publishedContests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Ended</p>
              <p className="text-2xl font-bold text-slate-800">{stats.endedContests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Votes</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalVotes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ended Contests with Results */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Contest Results</h2>

        {endedContests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8 text-center">
            <Clock className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Ended Contests Yet</h3>
            <p className="text-slate-600">Your completed contests and their results will appear here.</p>
          </div>
        ) : (
          endedContests.map((contest) => {
            const winners = getWinners(contest);
            const totalVotes = contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0;

            return (
              <div key={contest._id} className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Trophy className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{contest.name}</h3>
                      <p className="text-slate-600">{contest.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          Ended: {formatDate(contest.endDate)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Users className="h-4 w-4" />
                          {totalVotes} total votes
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Ended
                  </span>
                </div>

                {/* Winners Section */}
                {winners.length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">
                        Winner{winners.length > 1 ? 's' : ''} ({winners.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {winners.map((winner, index) => (
                        <div key={winner._id || index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-yellow-600" />
                            </div>
                            <span className="font-medium text-slate-800">{winner.name}</span>
                          </div>
                          <span className="text-sm text-slate-600">{winner.votes || 0} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Contestants */}
                {contest.contestants && contest.contestants.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">All Contestants</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contest.contestants.map((contestant, index) => (
                        <div key={contestant._id || index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                          <span className="text-slate-800">{contestant.name}</span>
                          <span className="text-sm text-slate-600">{contestant.votes || 0} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
