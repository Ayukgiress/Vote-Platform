import React, { useState, useEffect } from 'react';
import { FileText, Users, Clock, ExternalLink } from 'lucide-react';
import { useTheme } from '../../Pages/Contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../Pages/Constants/Constants';

const ActivePolls = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePolls();
  }, []);

  const fetchActivePolls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/contests/published`);
      if (response.data?.success) {
        setPolls(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching active polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Active Polls
          </h1>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Currently running contests and voting sessions
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl ${
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'
        }`}>
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {polls.length} Active
          </span>
        </div>
      </div>

      {/* Polls Grid */}
      {polls.length === 0 ? (
        <div className={`p-12 rounded-2xl border-2 border-dashed text-center ${
          theme === 'dark'
            ? 'border-slate-700/50 bg-slate-800/30'
            : 'border-slate-300 bg-slate-50'
        }`}>
          <FileText className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            No active polls
          </h3>
          <p className={`${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            There are no active contests running at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <div
              key={poll._id}
              className={`p-6 rounded-2xl border transition-all duration-200 hover:scale-105 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}
              onClick={() => navigate(`/vote/${poll._id}`)}
            >
              {/* Cover Image */}
              {poll.coverPhotoUrl && (
                <div className="mb-4">
                  <img
                    src={`${API_URL}/${poll.coverPhotoUrl.replace(/^\//, '')}`}
                    alt={poll.name}
                    className="w-full h-32 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className={`font-semibold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {poll.name}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {poll.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                        {poll.contestants?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                        {getTimeRemaining(poll.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category & Dates */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {poll.category}
                  </span>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Ends {formatDate(poll.endDate)}
                  </span>
                </div>

                {/* Vote Button */}
                <button
                  className={`w-full mt-4 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/${poll._id}/vote`, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Vote Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivePolls;
