import React, { useState, useEffect, useCallback } from "react";
import ContestModal from "../../Components/Modals/ContestModal";
import AddContestantModal from "../../Components/Modals/Contestants";
import { Plus, Loader2, Award, Users, BarChart3, Trophy } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../Contexts/AuthContext";
import { useTheme } from "../Contexts/ThemeContext";
import ContestItem from "../../Components/ContestItem";
import API_URL from "../../Pages/Constants/Constants";

const Overview = () => {
  const { currentUser, currentUserLoading, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [contests, setContests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [publishedContests, setPublishedContests] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [editingContest, setEditingContest] = useState(null);
  const [userIP, setUserIP] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token missing");
    }
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchUserIP = useCallback(async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Failed to get IP address:", error);
      return btoa(navigator.userAgent + Date.now()).substring(0, 16);
    }
  }, []);

  const calculateWinners = useCallback((contestsData) => {
    return contestsData.map((contest) => {
      const now = new Date();
      const endDate = new Date(contest.endDate);

      if (endDate < now && contest.contestants?.length > 0) {
        const sortedContestants = [...contest.contestants].sort(
          (a, b) => (b.votes || 0) - (a.votes || 0)
        );

        const highestVotes = sortedContestants[0].votes || 0;

        const winners = sortedContestants.filter(
          (contestant) => (contestant.votes || 0) === highestVotes
        );

        const updatedContestants = contest.contestants.map((contestant) => ({
          ...contestant,
          isWinner: winners.some((winner) => winner._id === contestant._id),
        }));

        const sortedUpdatedContestants = [...updatedContestants].sort(
          (a, b) => {
            if (a.isWinner && !b.isWinner) return -1;
            if (!a.isWinner && b.isWinner) return 1;
            return (b.votes || 0) - (a.votes || 0);
          }
        );

        return {
          ...contest,
          contestants: sortedUpdatedContestants,
          hasEnded: true,
        };
      }

      return {
        ...contest,
        contestants: [...(contest.contestants || [])].sort(
          (a, b) => (b.votes || 0) - (a.votes || 0)
        ),
        hasEnded: false,
      };
    });
  }, []);

  useEffect(() => {
    const initializeIP = async () => {
      const ip = await fetchUserIP();
      setUserIP(ip);
    };
    initializeIP();
  }, [fetchUserIP]);

  const fetchContests = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping fetch");
        return;
      }

      setLoading(true);
      const headers = getAuthHeaders();

      const response = await axios.get(`${API_URL}/contests/all`, { headers });
      console.log("Received contests data:", response.data);

      if (response.data?.success) {
        const processedContests = calculateWinners(response.data.data);
        setContests(processedContests);
        const publishedSet = new Set(
          processedContests
            .filter((contest) => contest.isPublished)
            .map((contest) => contest._id)
        );
        setPublishedContests(publishedSet);
      }
    } catch (error) {
      console.error("Fetch contests error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch contests");
    } finally {
      setLoading(false);
    }
  }, [calculateWinners, fetchUserIP, getAuthHeaders, isAuthenticated]);

  const handlePublishToggle = async (contestId) => {
    const contest = contests.find((c) => c._id === contestId);
    if (!contest?.contestants?.length) {
      toast.error("Contest must have at least one contestant to be published");
      return;
    }

    try {
      const headers = getAuthHeaders();
      const isPublished = !publishedContests.has(contestId);

      const response = await axios.patch(
        `${API_URL}/contests/${contestId}/publish`,
        { isPublished },
        { headers }
      );

      if (response.data.success) {
        setPublishedContests((prev) => {
          const newSet = new Set(prev);
          if (isPublished) {
            newSet.add(contestId);
          } else {
            newSet.delete(contestId);
          }
          return newSet;
        });

        await fetchContests();
        toast.success(
          isPublished ? "Contest published!" : "Contest unpublished"
        );
      }
    } catch (error) {
      console.error("Publish toggle error:", error);
      toast.error(
        error.response?.data?.error || "Failed to update contest status"
      );
    }
  };

  const handleVote = async (contestId, contestantId) => {
    try {
      if (!contestId || !contestantId) {
        toast.error("Invalid contest or contestant ID");
        return;
      }

      const contest = contests.find((c) => c._id === contestId);
      if (contest?.hasEnded) {
        toast.error("This contest has ended");
        return;
      }

      const ip = userIP || (await fetchUserIP());
      if (!ip) {
        toast.error("Unable to verify device");
        return;
      }
      if (!userIP) {
        setUserIP(ip);
      }

      const ipVotesKey = `ipVotes_${ip}`;
      const storedVotesRaw = localStorage.getItem(ipVotesKey);
      let votedContests = [];
      try {
        const parsedVotes = JSON.parse(storedVotesRaw || "[]");
        if (Array.isArray(parsedVotes)) {
          votedContests = parsedVotes;
        }
      } catch (error) {
        console.error("Failed to parse stored votes for IP:", error);
      }

      if (votedContests.includes(contestId)) {
        toast.error("You have already voted in this contest from this device");
        return;
      }

      const formattedContestantId = contestantId.toString();

      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(formattedContestantId)) {
        toast.error("Invalid contestant ID format");
        return;
      }

      const response = await axios.post(
        `${API_URL}/contests/${contestId}/vote`,
        { contestantId: formattedContestantId, userIP: ip },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      if (response.data.success) {
        const updatedVotes = Array.from(new Set([...votedContests, contestId]));
        localStorage.setItem(ipVotesKey, JSON.stringify(updatedVotes));
        toast.success("Vote cast successfully!");
        await fetchContests();
      } else {
        throw new Error(response.data.error || "Failed to cast vote");
      }
    } catch (error) {
      console.error("Voting error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to cast your vote";
      toast.error(errorMessage);
    }
  };

  const handleDeleteContest = async (contestId) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${API_URL}/contests/${contestId}`, { headers });
      setContests((prev) =>
        prev.filter((contest) => contest._id !== contestId)
      );
      toast.success("Contest deleted successfully");
    } catch (error) {
      console.error("Delete contest error:", error);
      toast.error("Failed to delete contest");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchContests();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-custom-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
              Dashboard Overview
            </h1>
            <p className={`mt-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Manage your contests and track performance
            </p>
          </div>
          <button
            onClick={() => {
              setEditingContest(null);
              setIsModalOpen(true);
            }}
            className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            }`}
          >
            <Plus className="h-5 w-5" />
            Create Contest
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:border-sky-400/50'
            : 'bg-white border-slate-200/60 hover:border-blue-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Total Contests</p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>{contests.length}</p>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark'
                ? 'bg-sky-500/20'
                : 'bg-blue-100'
            }`}>
              <Award className={`h-6 w-6 ${
                theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
              }`} />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:border-emerald-400/50'
            : 'bg-white border-slate-200/60 hover:border-green-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Active Contests</p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>
                {contests.filter(c => !c.hasEnded && c.isPublished).length}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark'
                ? 'bg-emerald-500/20'
                : 'bg-green-100'
            }`}>
              <Users className={`h-6 w-6 ${
                theme === 'dark' ? 'text-emerald-400' : 'text-green-600'
              }`} />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:border-purple-400/50'
            : 'bg-white border-slate-200/60 hover:border-purple-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Total Votes</p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>
                {contests.reduce((total, contest) =>
                  total + (contest.contestants?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0), 0
                )}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark'
                ? 'bg-purple-500/20'
                : 'bg-purple-100'
            }`}>
              <BarChart3 className={`h-6 w-6 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:border-orange-400/50'
            : 'bg-white border-slate-200/60 hover:border-orange-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>Ended Contests</p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>
                {contests.filter(c => c.hasEnded).length}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${
              theme === 'dark'
                ? 'bg-orange-500/20'
                : 'bg-orange-100'
            }`}>
              <Trophy className={`h-6 w-6 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Contests Section - Now matches card design */}
      <div className={`rounded-2xl shadow-lg border p-6 ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-slate-200/60'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>
            Your Contests
          </h2>
        </div>

        {contests.length === 0 ? (
          <div className="text-center py-12">
            <div className={`rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4 ${
              theme === 'dark'
                ? 'bg-sky-500/20'
                : 'bg-gradient-to-br from-blue-50 to-purple-50'
            }`}>
              <Award className={`h-12 w-12 ${
                theme === 'dark' ? 'text-sky-400' : 'text-blue-600'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>No contests yet</h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>Create your first contest to get started with voting</p>
            <button
              onClick={() => {
                setEditingContest(null);
                setIsModalOpen(true);
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              Create Your First Contest
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {contests.map((contest) => (
              <ContestItem
                key={contest._id}
                contest={contest}
                formatDate={formatDate}
                handlePublishToggle={handlePublishToggle}
                handleDeleteContest={handleDeleteContest}
                publishedContests={publishedContests}
                setIsContestantModalOpen={setIsContestantModalOpen}
                setSelectedContestId={setSelectedContestId}
                handleVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>

      <ContestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setContests={setContests}
        editingContest={editingContest}
      />
      <AddContestantModal
        isOpen={isContestantModalOpen}
        onClose={() => setIsContestantModalOpen(false)}
        contestId={selectedContestId}
        setContests={setContests}
        contestStatus={
          contests.find((c) => c._id === selectedContestId)?.isPublished
            ? "Published"
            : "Draft"
        }
      />
    </div>
  );
};

export default Overview;