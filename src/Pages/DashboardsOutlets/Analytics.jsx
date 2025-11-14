import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { BarChart3, TrendingUp, Users, Award, Calendar, Download, Loader2, ChevronDown, Filter, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import API_URL from '../Constants/Constants';

const Analytics = () => {
  const { currentUser, isAuthenticated } = useAuth();
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
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping analytics fetch");
        return;
      }

      setLoading(true);
      setError(null);

      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/contests/all`, { headers });

      if (response.data?.success) {
        const contests = response.data.data;

        // Calculate analytics from contests data
        const totalVotes = contests.reduce((total, contest) =>
          total + (contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0), 0
        );

        const activeContests = contests.filter(c => !c.hasEnded && c.isPublished).length;
        const totalContests = contests.length;
        const averageVotesPerContest = totalContests > 0 ? Math.round(totalVotes / totalContests) : 0;

        // Find top performing contest
        let topPerformingContest = { name: 'No contests yet', votes: 0 };
        if (contests.length > 0) {
          const contestWithMaxVotes = contests.reduce((max, contest) => {
            const contestVotes = contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0;
            return contestVotes > (max.votes || 0) ? { name: contest.name, votes: contestVotes } : max;
          }, { name: '', votes: 0 });
          topPerformingContest = contestWithMaxVotes;
        }

        // Generate vote trends based on actual contest data
        const voteTrends = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = date.toISOString().split('T')[0];

          // Calculate votes for contests created or active on this date
          const votesOnDate = contests.reduce((total, contest) => {
            const contestDate = new Date(contest.createdAt || contest.startDate).toISOString().split('T')[0];
            if (contestDate === dateStr) {
              return total + (contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0);
            }
            return total;
          }, 0);

          return {
            date: dateStr,
            votes: votesOnDate
          };
        });

        // Contest categories based on contest names and descriptions
        const categoryKeywords = {
          'Music': ['music', 'song', 'singer', 'band', 'concert', 'melody'],
          'Sports': ['sport', 'game', 'competition', 'tournament', 'athlete', 'team'],
          'Art': ['art', 'drawing', 'painting', 'design', 'creative', 'photography'],
          'Entertainment': ['movie', 'film', 'actor', 'celebrity', 'show', 'performance'],
          'Education': ['student', 'school', 'university', 'learning', 'academic'],
          'Other': []
        };

        const categoryCounts = {};
        contests.forEach(contest => {
          const text = `${contest.name} ${contest.description || ''}`.toLowerCase();
          let matchedCategory = 'Other';

          for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => text.includes(keyword))) {
              matchedCategory = category;
              break;
            }
          }

          categoryCounts[matchedCategory] = (categoryCounts[matchedCategory] || 0) + 1;
        });

        const contestCategories = Object.entries(categoryCounts)
          .map(([category, count]) => ({
            category,
            count,
            percentage: Math.round((count / contests.length) * 100)
          }))
          .sort((a, b) => b.count - a.count);

        setAnalyticsData({
          totalVotes,
          activeContests,
          totalContests,
          averageVotesPerContest,
          topPerformingContest,
          voteTrends,
          contestCategories
        });
      }
    } catch (error) {
      console.error("Fetch analytics error:", error);
      setError(error.response?.data?.error || "Failed to fetch analytics");
      toast.error(error.response?.data?.error || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!analyticsData) return;

    // Create CSV content
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Votes', analyticsData.totalVotes],
      ['Active Contests', analyticsData.activeContests],
      ['Total Contests', analyticsData.totalContests],
      ['Average Votes per Contest', analyticsData.averageVotesPerContest],
      ['Top Performing Contest', `${analyticsData.topPerformingContest.name} (${analyticsData.topPerformingContest.votes} votes)`],
      [],
      ['Vote Trends'],
      ['Date', 'Votes'],
      ...analyticsData.voteTrends.map(trend => [trend.date, trend.votes]),
      [],
      ['Contest Categories'],
      ['Category', 'Count', 'Percentage'],
      ...analyticsData.contestCategories.map(cat => [cat.category, cat.count, `${cat.percentage}%`])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'analytics-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Analytics data exported successfully!');
  };

  useEffect(() => {
    fetchAnalytics();
  }, [isAuthenticated]);

  const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Animated background gradient on hover */}
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
          <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
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
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4 font-medium">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-gray-600 text-lg mb-4 font-medium">No analytics data available</p>
          <p className="text-gray-500 text-sm">Start creating contests to see your analytics dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 w-full">
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

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl">
              Track your contest performance, voting trends, and audience engagement in real-time
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Filter className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 text-black font-medium"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            
            <button
              onClick={exportData}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 font-medium"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Votes"
            value={analyticsData.totalVotes.toLocaleString()}
            icon={BarChart3}
            trend={12}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={100}
          />
          <StatCard
            title="Active Contests"
            value={analyticsData.activeContests}
            icon={Award}
            trend={8}
            color="bg-gradient-to-br from-green-500 to-green-600"
            delay={200}
          />
          <StatCard
            title="Total Contests"
            value={analyticsData.totalContests}
            icon={Calendar}
            trend={0}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={300}
          />
          <StatCard
            title="Avg Votes/Contest"
            value={analyticsData.averageVotesPerContest}
            icon={TrendingUp}
            trend={-3}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            delay={400}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Vote Trends Chart */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Vote Trends</h3>
                <p className="text-gray-600 mt-1">Voting activity over time</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.voteTrends}>
                  <defs>
                    <linearGradient id="voteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#f1f5f9" 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="votes"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#voteGradient)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1d4ed8' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Contest Categories */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contest Categories</h3>
                <p className="text-gray-600 mt-1">Distribution by category</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.contestCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="count"
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                    labelLine={false}
                  >
                    {analyticsData.contestCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0 ? "#3b82f6" :
                          index === 1 ? "#10b981" :
                          index === 2 ? "#8b5cf6" :
                          index === 3 ? "#f59e0b" :
                          "#ef4444"
                        }
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(8px)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {analyticsData.contestCategories.map((category, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? "bg-blue-500" :
                    index === 1 ? "bg-green-500" :
                    index === 2 ? "bg-purple-500" :
                    index === 3 ? "bg-orange-500" : "bg-red-500"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{category.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{category.count}</p>
                    <p className="text-xs text-gray-500">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Top Performing Contest</h3>
              <p className="text-blue-100 text-lg">
                {analyticsData.topPerformingContest.name}
              </p>
              <p className="text-blue-200 mt-1">
                {analyticsData.topPerformingContest.votes.toLocaleString()} total votes
              </p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Award className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;