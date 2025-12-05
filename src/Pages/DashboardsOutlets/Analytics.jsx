import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3, TrendingUp, Award, Calendar, Download, Loader2, ChevronDown, Filter, Sparkles, MousePointerClick, RefreshCw } from 'lucide-react';
import { API_URL } from '../Constants/Constants';
import { useAuth } from '../Contexts/AuthContext';
import { useTheme } from '../Contexts/ThemeContext';

const Analytics = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token missing");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/contests/all`, { 
        headers,
        method: 'GET'
      });

      const data = await response.json();

      if (data?.success) {
        const contests = data.data;

        // Calculate total votes
        const totalVotes = contests.reduce((total, contest) =>
          total + (contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0), 0
        );

        // Count active contests
        const activeContests = contests.filter(c => !c.hasEnded && c.isPublished).length;
        const totalContests = contests.length;

        // Calculate average votes per contest
        const averageVotesPerContest = totalContests > 0 ? Math.round(totalVotes / totalContests) : 0;

        // Find top performing contest
        let topPerformingContest = { name: 'No contests yet', votes: 0 };
        if (contests.length > 0) {
          const contestWithMaxVotes = contests.reduce((max, contest) => {
            const contestVotes = contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0;
            return contestVotes > max.votes ? { name: contest.name, votes: contestVotes } : max;
          }, { name: '', votes: 0 });
          topPerformingContest = contestWithMaxVotes;
        }

        // Generate vote trends for last 7 days
        const voteTrends = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = date.toISOString().split('T')[0];

          // Calculate votes for contests active on this date
          const votesOnDate = contests.reduce((total, contest) => {
            const contestDate = new Date(contest.createdAt || contest.startDate).toISOString().split('T')[0];
            if (contestDate <= dateStr) {
              return total + (contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0);
            }
            return total;
          }, 0);

          return {
            date: dateStr,
            votes: Math.round(votesOnDate / contests.length) || 0
          };
        });

        // Categorize contests using the category field from contest creation
        const categoryCounts = {};
        contests.forEach(contest => {
          const category = contest.category || 'Other';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const contestCategories = Object.entries(categoryCounts)
          .map(([category, count]) => ({
            category,
            count,
            percentage: contests.length > 0 ? Math.round((count / contests.length) * 100) : 0
          }))
          .filter(cat => cat.count > 0)
          .sort((a, b) => b.count - a.count);

        // Top 5 contests by votes
        const topContests = contests
          .map(contest => ({
            name: contest.name,
            votes: contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0,
            id: contest._id
          }))
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 5);

        // Votes per contest data for bar chart
        const votesPerContest = contests
          .map(contest => ({
            name: contest.name.length > 15 ? contest.name.substring(0, 15) + '...' : contest.name,
            votes: contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0,
            fullName: contest.name
          }))
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 10);

        // Contest creation trends for last 30 days
        const contestCreationTrends = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          const dateStr = date.toISOString().split('T')[0];

          const contestsCreated = contests.filter(contest => {
            const createdDate = new Date(contest.createdAt || contest.startDate).toISOString().split('T')[0];
            return createdDate === dateStr;
          }).length;

          return {
            date: dateStr,
            contests: contestsCreated
          };
        });

        setAnalyticsData({
          totalVotes,
          activeContests,
          totalContests,
          averageVotesPerContest,
          topPerformingContest,
          voteTrends,
          contestCategories,
          topContests,
          votesPerContest,
          contestCreationTrends
        });
      }
    } catch (error) {
      console.error("Fetch analytics error:", error);
      setError(error.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!analyticsData) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Votes', analyticsData.totalVotes],
      ['Active Contests', analyticsData.activeContests],
      ['Total Contests', analyticsData.totalContests],
      ['Average Votes per Contest', analyticsData.averageVotesPerContest],
      [],
      ['Top Performing Contest', analyticsData.topPerformingContest.name, analyticsData.topPerformingContest.votes],
      [],
      ['Vote Trends'],
      ['Date', 'Votes'],
      ...analyticsData.voteTrends.map(t => [t.date, t.votes]),
      [],
      ['Contest Categories'],
      ['Category', 'Count', 'Percentage'],
      ...analyticsData.contestCategories.map(c => [c.category, c.count, `${c.percentage}%`])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <div
      className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
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
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <p className={`text-sm font-medium uppercase tracking-wide ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>{title}</p>
        <p className={`text-4xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-slate-800'
        }`}>{value}</p>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl">
          <p className="text-gray-600 font-medium mb-2">
            {new Date(label).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-blue-600 font-bold text-lg">
            {payload[0].value} votes
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-custom-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4 font-medium">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20'
    }`}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header Section - Now matches card design */}
        <div className={`rounded-2xl shadow-lg border p-6 ${
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
                Analytics Dashboard
              </h1>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Real-time performance insights and comprehensive analytics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchAnalytics}
                className={`p-2.5 rounded-xl transition-colors shadow-sm ${
                  theme === 'dark'
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <RefreshCw className="h-5 w-5" />
              </button>

              <button
                onClick={exportData}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Votes"
            value={analyticsData.totalVotes.toLocaleString()}
            icon={MousePointerClick}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard
            title="Active Contests"
            value={analyticsData.activeContests}
            icon={TrendingUp}
            color="bg-gradient-to-br from-green-500 to-green-600"
            delay={100}
          />
          <StatCard
            title="Total Contests"
            value={analyticsData.totalContests}
            icon={Calendar}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={200}
          />
          <StatCard
            title="Avg Votes/Contest"
            value={analyticsData.averageVotesPerContest}
            icon={Award}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            delay={300}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Contests */}
          <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
              : 'bg-white border-slate-200/60 hover:border-blue-300'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>Top Performing Contests</h3>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Your most popular contests by votes</p>
              </div>
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-50'
              }`}>
                <Award className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
              </div>
            </div>

            <div className="space-y-3">
              {analyticsData.topContests.map((contest, index) => (
                <div key={index} className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 hover:bg-slate-600/50'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-200 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{contest.name}</p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                    }`}>{contest.votes.toLocaleString()} votes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contest Categories */}
          <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
              : 'bg-white border-slate-200/60 hover:border-blue-300'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>Contest Categories</h3>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Distribution by category</p>
              </div>
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-50'
              }`}>
                <Award className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.contestCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="count"
                    label={({ category, percentage }) => `${category} ${percentage}%`}
                  >
                    {analyticsData.contestCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'][index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {analyticsData.contestCategories.map((cat, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 hover:bg-slate-600/50'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'][index] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{cat.category}</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>{cat.count} contests</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Votes per Contest Bar Chart */}
          <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 hover:border-emerald-400/50'
              : 'bg-white border-slate-200/60 hover:border-green-300'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>Votes per Contest</h3>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Top 10 contests by vote count</p>
              </div>
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-50'
              }`}>
                <BarChart3 className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.votesPerContest} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f1f5f9'} vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#64748b' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className={`p-3 rounded-lg shadow-lg border ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}>
                            <p className="font-medium">{data.fullName}</p>
                            <p className="text-blue-600 font-bold">{payload[0].value} votes</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="votes"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Contest Creation Trends Line Chart */}
          <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10 hover:border-orange-400/50'
              : 'bg-white border-slate-200/60 hover:border-orange-300'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>Contest Creation Trends</h3>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>New contests created over last 30 days</p>
              </div>
              <div className={`p-2 rounded-lg ${
                theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-50'
              }`}>
                <Calendar className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`} />
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.contestCreationTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f1f5f9'} vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#64748b' }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#64748b' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className={`p-3 rounded-lg shadow-lg border ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white'
                              : 'bg-white border-gray-200 text-gray-900'
                          }`}>
                            <p className="font-medium">
                              {new Date(label).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-orange-600 font-bold">{payload[0].value} contests created</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="contests"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#d97706' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>



        {/* Top Contest Highlight */}
        <div className={`rounded-2xl shadow-lg border p-8 transition hover:-translate-y-1 hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 border-white/10'
            : 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-slate-200/60'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>🏆 Best Performer</h3>
              <p className={`text-lg mb-1 ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
              }`}>{analyticsData.topPerformingContest.name}</p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>{analyticsData.topPerformingContest.votes.toLocaleString()} total votes</p>
            </div>
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-white/10' : 'bg-white/60'
            }`}>
              <Award className={`h-10 w-10 ${
                theme === 'dark' ? 'text-sky-400' : 'text-purple-600'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;