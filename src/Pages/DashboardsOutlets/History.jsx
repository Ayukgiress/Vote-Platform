import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Calendar, Users, Loader2, BarChart3, CheckCircle, XCircle, Award, Sparkles, TrendingUp, Crown, Star } from 'lucide-react';
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
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, delay }) => (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              trend > 0 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg">Loading contest history...</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Contest History
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl">
              Review your contest performance, winners, and comprehensive results
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Contests"
            value={stats.totalContests}
            icon={BarChart3}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={100}
          />
          <StatCard
            title="Published"
            value={stats.publishedContests}
            icon={CheckCircle}
            color="bg-gradient-to-br from-green-500 to-green-600"
            delay={200}
          />
          <StatCard
            title="Ended"
            value={stats.endedContests}
            icon={XCircle}
            color="bg-gradient-to-br from-red-500 to-red-600"
            delay={300}
          />
          <StatCard
            title="Total Votes"
            value={stats.totalVotes}
            icon={Users}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={400}
          />
        </div>

        {/* Ended Contests with Results */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Award className="h-5 w-5 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contest Results</h2>
          </div>

          {endedContests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-12 text-center group">
              <div className="relative inline-block mb-4">
                <Clock className="h-20 w-20 text-gray-300 group-hover:text-gray-400 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-60" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Ended Contests Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                Your completed contests and their results will appear here once contests have ended.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {endedContests.map((contest, index) => {
                const winners = getWinners(contest);
                const totalVotes = contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0;
                const isTie = winners.length > 1;

                return (
                  <div 
                    key={contest._id} 
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    {/* Contest Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {contest.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                            {contest.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Ended {formatDate(contest.endDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {totalVotes.toLocaleString()} votes
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200">
                        Ended
                      </span>
                    </div>

                    {/* Winners Section */}
                    {winners.length > 0 && (
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Crown className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm font-semibold text-yellow-800 uppercase tracking-wide">
                            {isTie ? 'Tie Winners' : 'Winner'} ({winners.length})
                          </span>
                        </div>
                        <div className="space-y-3">
                          {winners.map((winner, winnerIndex) => (
                            <div 
                              key={winner._id || winnerIndex} 
                              className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-yellow-300/50 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                  <Trophy className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <span className="font-bold text-gray-900 text-lg">{winner.name}</span>
                                  <p className="text-sm text-gray-600">{winner.votes || 0} votes</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-semibold">1st</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Contestants */}
                    {contest.contestants && contest.contestants.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            All Contestants ({contest.contestants.length})
                          </span>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {contest.contestants
                            .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                            .map((contestant, contestantIndex) => {
                              const isWinner = winners.some(w => w._id === contestant._id);
                              return (
                                <div 
                                  key={contestant._id || contestantIndex} 
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                    isWinner 
                                      ? 'bg-blue-50 border-blue-200' 
                                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                      isWinner 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      {contestantIndex + 1}
                                    </div>
                                    <span className={`font-medium ${
                                      isWinner ? 'text-blue-900' : 'text-gray-800'
                                    }`}>
                                      {contestant.name}
                                    </span>
                                    {isWinner && (
                                      <Crown className="h-4 w-4 text-yellow-500" />
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className={`font-semibold ${
                                      isWinner ? 'text-blue-700' : 'text-gray-700'
                                    }`}>
                                      {contestant.votes || 0}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-1">votes</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;