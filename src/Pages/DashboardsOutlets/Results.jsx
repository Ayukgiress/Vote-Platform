import React, { useState, useEffect } from 'react';
import { TrendingUp, Trophy, Users, Calendar } from 'lucide-react';
import { useTheme } from '../../Pages/Contexts/ThemeContext';
import axios from 'axios';
import API_URL from '../../Pages/Constants/Constants';

const Results = () => {
  const { theme } = useTheme();
  const [completedContests, setCompletedContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedContests();
  }, []);

  const fetchCompletedContests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/contests/completed`);
      if (response.data?.success) {
        setCompletedContests(response.data.contests || []);
      }
    } catch (error) {
      console.error('Error fetching completed contests:', error);
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

  const getTotalVotes = (contestants) => {
    return contestants?.reduce((total, contestant) => total + (contestant.votes || 0), 0) || 0;
  };

  const getWinner = (contestants) => {
    if (!contestants || contestants.length === 0) return null;
    return contestants.reduce((winner, contestant) =>
      (contestant.votes || 0) > (winner.votes || 0) ? contestant : winner
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-slate-700 rounded-2xl"></div>
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
            Results
          </h1>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            View completed contest results and winners
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl ${
          theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'
        }`}>
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {completedContests.length} Completed
          </span>
        </div>
      </div>

      {/* Results Grid */}
      {completedContests.length === 0 ? (
        <div className={`p-12 rounded-2xl border-2 border-dashed text-center ${
          theme === 'dark'
            ? 'border-slate-700/50 bg-slate-800/30'
            : 'border-slate-300 bg-slate-50'
        }`}>
          <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-slate-600' : 'text-slate-400'
          }`} />
          <h3 className={`text-lg font-medium mb-2 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            No completed contests yet
          </h3>
          <p className={`${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Results will appear here once contests have ended.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedContests.map((contest) => {
            const winner = getWinner(contest.contestants);
            const totalVotes = getTotalVotes(contest.contestants);

            return (
              <div
                key={contest._id}
                className={`p-6 rounded-2xl border transition-all duration-200 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                {/* Cover Image */}
                {contest.coverPhotoUrl && (
                  <div className="mb-4">
                    <img
                      src={`${API_URL}/${contest.coverPhotoUrl.replace(/^\//, '')}`}
                      alt={contest.name}
                      className="w-full h-32 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold text-xl ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {contest.name}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {contest.description}
                    </p>
                  </div>

                  {/* Winner Section */}
                  {winner && (
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Trophy className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
                          }`}>
                            Winner
                          </p>
                          <p className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {winner.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {winner.votes || 0} votes
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          Participants
                        </span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {contest.contestants?.length || 0}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          Total Votes
                        </span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>
                        {totalVotes}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      theme === 'dark'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {contest.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>Ended {formatDate(contest.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
