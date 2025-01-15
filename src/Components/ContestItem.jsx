import React from "react";
import { Trash2, Users, Trophy } from "lucide-react";
import ContestantItem from "./ContastantItem";

const ContestItem = ({
  contest,
  formatDate,
  handlePublishToggle,
  handleDeleteContest,
  publishedContests,
  setIsContestantModalOpen,
  setSelectedContestId,
  handleVote
}) => {
  const isPublished = publishedContests.has(contest._id);
  const now = new Date();
  const endDate = new Date(contest.endDate);
  const hasEnded = endDate < now;

  const getContestStatus = () => {
    if (hasEnded) return "ended";
    if (isPublished) return "active";
    return "draft";
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "ended":
        return "bg-gray-100 text-gray-800";
      case "active":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ended":
        return "Ended";
      case "active":
        return "Active";
      default:
        return "Draft";
    }
  };

  const status = getContestStatus();
  const statusBadgeStyle = getStatusBadgeStyle(status);
  const statusText = getStatusText(status);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {contest.title}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeStyle}`}
            >
              {statusText}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedContestId(contest._id);
              setIsContestantModalOpen(true);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            disabled={hasEnded}
          >
            <Users className="h-4 w-4" />
            Add Contestant
          </button>
          {!hasEnded && (
            <button
              onClick={() => handlePublishToggle(contest._id)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isPublished
                  ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                  : "bg-green-100 hover:bg-green-200 text-green-800"
              }`}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </button>
          )}
          <button
            onClick={() => handleDeleteContest(contest._id)}
            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {contest.contestants && contest.contestants.length > 0 ? (
        <div className="space-y-4">
          {hasEnded && contest.contestants.some(c => c.isWinner) && (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 p-3 rounded-lg">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">
                Contest ended - Winner{contest.contestants.filter(c => c.isWinner).length > 1 ? 's' : ''} announced!
              </span>
            </div>
          )}
          
          <div className="space-y-4">
            {contest.contestants.map((contestant) => (
              <ContestantItem
                key={contestant._id}
                contestant={contestant}
                handleVote={handleVote}
                contest={contest}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600">
          No contestants yet. Add contestants to get started!
        </div>
      )}
    </div>
  );
};

export default ContestItem;