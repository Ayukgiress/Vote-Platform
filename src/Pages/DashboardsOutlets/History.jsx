import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Calendar, Users, Loader2, BarChart3, CheckCircle, XCircle, Award, Sparkles, TrendingUp, Crown, Star } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { useTheme } from '../Contexts/ThemeContext';
import API_URL from '../Constants/Constants';

const History = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { theme } = useTheme();
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
      className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
          : 'bg-white border-slate-200/60 hover:border-blue-300'
      }`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>{title}</p>
          <p className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl ${
          theme === 'dark'
            ? 'bg-sky-500/20'
            : 'bg-blue-100'
        }`}>
          <Icon className={`h-6 w-6 ${
            theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
          }`} />
        </div>
      </div>
    </div>
  );

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
        {/* Header Section - Now matches card design */}
        {/* <div className={`rounded-2xl shadow-lg border p-6 ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-slate-200/60'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
              }`}>
                Contest History
              </h1>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Review your contest performance, winners, and comprehensive results
              </p>
            </div>
          </div>
        </div> */}

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

        {/* Contest Results Section - Now matches card design */}
        <div className={`rounded-2xl shadow-lg border p-6 ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-slate-200/60'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>
              Contest Results
            </h2>
          </div>

          {endedContests.length === 0 ? (
            <div className="text-center py-12">
              <div className={`rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4 ${
                theme === 'dark'
                  ? 'bg-sky-500/20'
                  : 'bg-gradient-to-br from-blue-50 to-purple-50'
              }`}>
                <Clock className={`h-12 w-12 ${
                  theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>No Ended Contests Yet</h3>
              <p className={`mb-6 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Your completed contests and their results will appear here once contests have ended.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {endedContests.map((contest, index) => {
                const winners = getWinners(contest);
                const totalVotes = contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0;
                const isTie = winners.length > 1;

                return (
                  <div
                    key={contest._id}
                    className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
                        : 'bg-white border-slate-200/60 hover:border-blue-300'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    {/* Contest Header */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                            <Trophy className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-xl font-bold mb-2 ${
                              theme === 'dark' ? 'text-white' : 'text-slate-800'
                            }`}>
                              {contest.name}
                            </h3>
                            <p className={`text-sm leading-relaxed mb-3 ${
                              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {contest.description}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-200 ml-4">
                          Ended
                        </span>
                      </div>

                      {/* Date Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Start Date Card */}
                        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                            }`}>
                              <Calendar className={`h-5 w-5 ${
                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                              }`} />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-wide ${
                              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                            }`}>
                              Start Date
                            </span>
                          </div>
                          <p className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-slate-800'
                          }`}>
                            {formatDate(contest.startDate)}
                          </p>
                        </div>

                        {/* End Date Card */}
                        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                            : 'bg-red-50 border-red-200 hover:bg-red-100'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
                            }`}>
                              <Calendar className={`h-5 w-5 ${
                                theme === 'dark' ? 'text-red-400' : 'text-red-600'
                              }`} />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-wide ${
                              theme === 'dark' ? 'text-red-300' : 'text-red-700'
                            }`}>
                              End Date
                            </span>
                          </div>
                          <p className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-slate-800'
                          }`}>
                            {formatDate(contest.endDate)}
                          </p>
                        </div>

                        {/* Total Votes Card */}
                        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                            : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                            }`}>
                              <Users className={`h-5 w-5 ${
                                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                              }`} />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-wide ${
                              theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
                            }`}>
                              Total Votes
                            </span>
                          </div>
                          <p className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-slate-800'
                          }`}>
                            {totalVotes.toLocaleString()}
                          </p>
                        </div>
                      </div>
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
                          <Users className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`} />
                          <span className={`text-sm font-semibold uppercase tracking-wide ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
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