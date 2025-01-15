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
      await handleVote(contestant.contestId, contestantId);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      bg-gray-100 rounded-lg p-4 flex items-center justify-between
      ${isWinner ? 'border-2 border-yellow-400 bg-yellow-50' : ''}
    `}>
      <div className="flex items-center space-x-4">
        {contestant.photoUrl ? (
          <div className="relative">
            <img
              src={
                contestant.photoUrl.startsWith("http")
                  ? contestant.photoUrl
                  : `${API_URL}/${contestant.photoUrl}`
              }
              alt={contestant.name || "Contestant"}
              className="h-24 w-24 object-cover rounded-full"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
            {isWinner && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="h-24 w-24 bg-gray-200 flex items-center justify-center rounded-full">
              <span className="text-gray-500 text-2xl">
                {contestant.name?.charAt(0) || "?"}
              </span>
            </div>
            {isWinner && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-gray-800 font-medium">
              {contestant.name || "Unnamed Contestant"}
            </p>
            {isWinner && (
              <span className="bg-yellow-400 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                Winner!
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            Votes: {contestant.votes || 0}
          </p>
        </div>
      </div>

      <button
        onClick={() => handleVoteClick(contestant._id)}
        disabled={loading || isContestEnded}
        className={`
          px-4 py-2 rounded-lg
          ${isContestEnded 
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-custom-blue hover:bg-custom-blue/90 text-white'}
        `}
      >
        {loading ? "Voting..." : isContestEnded ? "Contest Ended" : "Vote"}
      </button>
    </div>
  );
};

export default ContestantItem;