import React, { useState } from "react";
import { Trophy } from "lucide-react";
import API_URL from "../Pages/Constants/Constants";

const ContestantItem = ({ contestant, handleVote, contest }) => {
  const [loading, setLoading] = useState(false);

  const isContestEnded = new Date(contest.endDate) < new Date();
  const isWinner = isContestEnded && contestant.isWinner;

  const handleVoteClick = async (contestantId) => {
    if (loading || isContestEnded) return;

    setLoading(true);
    try {
      await handleVote(contest._id, contestantId);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-lg p-6 flex flex-col items-center text-center shadow-lg border border-slate-200/60 hover:shadow-xl transition-shadow duration-200
      ${isWinner ? 'border-2 border-yellow-400 bg-yellow-50' : ''}
    `}>
      <div className="relative mb-4">
        {contestant.photoUrl ? (
          <img
            src={
              contestant.photoUrl.startsWith("https")
                ? contestant.photoUrl
                : `${API_URL}/${contestant.photoUrl.replace(/^\//, '')}`
            }
            alt={contestant.name || "Contestant"}
            className="h-32 w-32 object-cover rounded-full border-4 border-gray-100"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
        ) : (
          <div className="h-32 w-32 bg-gray-200 flex items-center justify-center rounded-full border-4 border-gray-100">
            <span className="text-gray-500 text-3xl">
              {contestant.name?.charAt(0) || "?"}
            </span>
          </div>
        )}
        {isWinner && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-gray-800 font-semibold text-lg">
            {contestant.name || "Unnamed Contestant"}
          </p>
          {isWinner && (
            <span className="bg-yellow-400 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
              Winner!
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">
          {contestant.votes || 0} votes
        </p>
      </div>

      <button
        onClick={() => handleVoteClick(contestant._id)}
        disabled={loading || isContestEnded}
        className={`
          w-full px-6 py-3 rounded-lg font-medium transition-colors duration-200
          ${isContestEnded
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'}
        `}
      >
        {loading ? "Voting..." : isContestEnded ? "Contest Ended" : "Vote"}
      </button>
    </div>
  );
};

export default ContestantItem;