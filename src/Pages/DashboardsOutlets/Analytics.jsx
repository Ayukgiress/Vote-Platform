import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, Calendar, Download, Loader2 } from 'lucide-react';
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

        // Generate vote trends (simplified - you might want to implement actual trend data from backend)
        const voteTrends = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toISOString().split('T')[0],
            votes: Math.floor(Math.random() * 100) + 20 // Placeholder - replace with real data
          };
        });

        // Contest categories (simplified - you might want to add categories to contests)
        const contestCategories = [
          { category: 'Music', count: Math.floor(contests.length * 0.33), percentage: 33 },
          { category: 'Sports', count: Math.floor(contests.length * 0.27), percentage: 27 },
          { category: 'Art', count: Math.floor(contests.length * 0.2), percentage: 20 },
          { category: 'Other', count: contests.length - Math.floor(contests.length * 0.8), percentage: 20 }
        ];

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

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
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
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-2">Track your contest performance and voting trends</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={exportData}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Votes"
          value={analyticsData.totalVotes.toLocaleString()}
          icon={BarChart3}
          trend={12}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Contests"
          value={analyticsData.activeContests}
          icon={Award}
          trend={8}
          color="bg-green-500"
        />
        <StatCard
          title="Total Contests"
          value={analyticsData.totalContests}
          icon={Calendar}
          trend={0}
          color="bg-purple-500"
        />
        <StatCard
          title="Avg Votes/Contest"
          value={analyticsData.averageVotesPerContest}
          icon={TrendingUp}
          trend={-3}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vote Trends Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Vote Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.voteTrends.map((data, index) => {
              const maxVotes = Math.max(...analyticsData.voteTrends.map(d => d.votes));
              const height = (data.votes / maxVotes) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-full mb-2 transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  ></div>
                  <span className="text-xs text-slate-500 transform -rotate-45 origin-top">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contest Categories */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Contest Categories</h3>
          <div className="space-y-4">
            {analyticsData.contestCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-slate-700 font-medium">{category.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">{category.count} contests</span>
                  <span className="text-slate-500 text-sm">({category.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Top Performing Contest</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-800">
                {analyticsData.topPerformingContest.name}
              </h4>
              <p className="text-slate-600 mt-1">
                {analyticsData.topPerformingContest.votes} total votes
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New contest created', contest: 'Photography Contest', time: '2 hours ago' },
            { action: 'Contest published', contest: 'Dance Competition', time: '5 hours ago' },
            { action: 'New votes received', contest: 'Best Singer Contest', time: '1 day ago' },
            { action: 'Contest ended', contest: 'Art Exhibition', time: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
              <div>
                <p className="text-slate-800 font-medium">{activity.action}</p>
                <p className="text-slate-600 text-sm">{activity.contest}</p>
              </div>
              <span className="text-slate-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
