import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import API_URL from '../../Pages/Constants/Constants';


const Vote = () => {
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [userIP, setUserIP] = useState(null);

  const contestId = window.location.pathname.split('/')[1];

  // Function to get user's IP address
  const getUserIP = useCallback(async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Failed to get IP address:', error);
      // Fallback: use a hash of user agent and timestamp as pseudo-identifier
      return btoa(navigator.userAgent + Date.now()).substring(0, 16);
    }
  }, []);

  const fetchContestDetails = useCallback(async ({ withLoader = true, withErrorToast = true } = {}) => {
    try {
      if (withLoader) {
        setLoading(true);
      }
      const response = await axios.get(`${API_URL}/contests/${contestId}`);
      console.log('Contest response:', response.data);
      if (response.data?.success) {
        setContest(response.data.contest);
      } else if (withErrorToast) {
        toast.error('Contest not found');
      }
    } catch (error) {
      console.error('Fetch contest error:', error);
      if (withErrorToast) {
        toast.error(error.response?.data?.error || 'Failed to load contest details');
      }
    } finally {
      if (withLoader) {
        setLoading(false);
      }
    }
  }, [contestId]);

  useEffect(() => {
    const initializeVoting = async () => {
      // Get user's IP address
      const ip = await getUserIP();
      setUserIP(ip);

      const existingContestVotes = localStorage.getItem(`contestVotes_${contestId}`);
      const parsedContestVotes = existingContestVotes ? JSON.parse(existingContestVotes) : [];
      if (!parsedContestVotes.includes(ip)) {
        localStorage.setItem(
          `contestVotes_${contestId}`,
          JSON.stringify([...parsedContestVotes, ip])
        );
      }

      // Check if this IP has already voted in this contest
      const ipVotesKey = `ipVotes_${ip}`;
      const storedVotesRaw = localStorage.getItem(ipVotesKey);
      let votedContests = [];
      try {
        const parsedVotes = JSON.parse(storedVotesRaw || '[]');
        if (Array.isArray(parsedVotes)) {
          votedContests = parsedVotes;
        }
      } catch (error) {
        console.error('Failed to parse stored votes for IP:', error);
      }
      setHasVoted(votedContests.includes(contestId));

      // Also fetch contest details
      fetchContestDetails();
    };

    initializeVoting();
  }, [contestId, fetchContestDetails, getUserIP]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchContestDetails({ withLoader: false, withErrorToast: false });
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchContestDetails]);

  const handleVote = async (contestantId) => {
    if (hasVoted) {
      toast.error('You have already voted in this contest from this device. Each device can only vote once per contest.');
      return;
    }

    if (!userIP) {
      toast.error('Unable to verify your device. Please try again.');
      return;
    }

    // Optimistic update: increment vote count locally
    setContest(prevContest => ({
      ...prevContest,
      contestants: prevContest.contestants.map(contestant =>
        contestant._id === contestantId
          ? { ...contestant, votes: (contestant.votes || 0) + 1 }
          : contestant
      )
    }));

    try {
      setVotingInProgress(true);
      const response = await axios.post(
        `${API_URL}/contests/${contestId}/vote`,
        { contestantId, userIP }
      );

      if (response.data.success) {
        // Store vote record per IP address
        const ipVotesKey = `ipVotes_${userIP}`;
        const storedVotesRaw = localStorage.getItem(ipVotesKey);
        let votedContests = [];
        try {
          const parsedVotes = JSON.parse(storedVotesRaw || '[]');
          if (Array.isArray(parsedVotes)) {
            votedContests = parsedVotes;
          }
        } catch (error) {
          console.error('Failed to parse stored votes for IP:', error);
        }
        const updatedVotes = Array.from(new Set([...votedContests, contestId]));
        localStorage.setItem(ipVotesKey, JSON.stringify(updatedVotes));

        setHasVoted(true);
        toast.success('Vote cast successfully!');
        // Fetch latest data to ensure accuracy
        await fetchContestDetails();
      } else {
        // Revert optimistic update on failure
        setContest(prevContest => ({
          ...prevContest,
          contestants: prevContest.contestants.map(contestant =>
            contestant._id === contestantId
              ? { ...contestant, votes: Math.max((contestant.votes || 0) - 1, 0) }
              : contestant
          )
        }));
        toast.error('Failed to cast your vote. Please try again.');
      }
    } catch (error) {
      console.error('Voting error:', error);
      // Revert optimistic update on error
      setContest(prevContest => ({
        ...prevContest,
        contestants: prevContest.contestants.map(contestant =>
          contestant._id === contestantId
            ? { ...contestant, votes: Math.max((contestant.votes || 0) - 1, 0) }
            : contestant
        )
      }));
      const errorMessage = error.response?.data?.error || 'Failed to cast your vote.';
      toast.error(errorMessage);
    } finally {
      setVotingInProgress(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-custom-blue" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-800">Contest Not Found</h2>
          <p className="text-red-600 mt-2">This contest doesn't exist or has ended.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{contest.name}</h1>
            <p className="text-slate-300 text-lg">{contest.description}</p>
          </div>

          {contest.coverPhotoUrl && (
            <div className="mb-8 flex justify-center">
              <img
                src={`${API_URL}/${contest.coverPhotoUrl.replace(/^\//, '')}`}
                alt={contest.name}
                className="w-full max-w-2xl h-64 object-cover rounded-2xl border border-white/10"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center">Choose Your Favorite</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {contest.contestants.map((contestant) => (
                <div
                  key={contestant._id}
                  className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-700 border-2 border-white/20">
                      {contestant.photoUrl ? (
                        <img
                          src={contestant.photoUrl.startsWith('http')
                            ? contestant.photoUrl
                            : `${API_URL}/${contestant.photoUrl.replace(/^\//, '')}`}
                          alt={contestant.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-3xl text-slate-400">
                            {contestant.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-xl">{contestant.name}</h3>
                      <p className="text-slate-400">Votes: {contestant.votes || 0}</p>
                    </div>
                    <button
                      onClick={() => handleVote(contestant._id)}
                      disabled={hasVoted || votingInProgress}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        hasVoted || votingInProgress
                          ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                          : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {votingInProgress ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : hasVoted ? (
                        'Voted ✓'
                      ) : (
                        'Vote'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;