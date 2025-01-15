import React from "react";
import { Trash2, Users, Trophy, Info } from "lucide-react";
import ContestantItem from "./ContastantItem";
import API_URL from "../Pages/Constants/Constants";

const ContestItem = ({
  contest,
  formatDate,
  handlePublishToggle,
  handleDeleteContest,
  publishedContests,
  setIsContestantModalOpen,
  setSelectedContestId,
  handleVote,
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
        return "bg-gray-300 text-gray-800";
      case "active":
        return "bg-green-300 text-green-800";
      default:
        return "bg-yellow-300 text-yellow-800";
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
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {contest.name}
            </h2>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${statusBadgeStyle}`}
            >
              {statusText}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              setSelectedContestId(contest._id);
              setIsContestantModalOpen(true);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            disabled={hasEnded}
          >
            <Users className="h-5 w-5" />
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
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4 sm:p-6">
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-200">
  <img
    src={contest.coverPhotoUrl.startsWith('https') ? 
      contest.coverPhotoUrl : 
      `${API_URL}/${contest.coverPhotoUrl}`}
    alt={contest.name}
    className="w-full h-48 sm:h-64 object-cover"
    onError={(e) => {
      console.log('Image load failed:', e.target.src);
      e.target.src = "/api/placeholder/400/320";
      e.target.onerror = null;
    }}
  />
</div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Description</h3>
                <p className="text-gray-700 mt-1">{contest.description}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
              <h4 className="text-gray-900 font-medium">Start Date</h4>
              <p className="text-gray-700 mt-2">
                {formatDate(contest.startDate)}
              </p>
            </div>

            <div className="flex-1 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
              <h4 className="text-gray-900 font-medium">End Date</h4>
              <p className="text-gray-700 mt-2">
                {formatDate(contest.endDate)}
              </p>
            </div>
          </div>
          {isPublished && !hasEnded && (
            <div className="mt-4 text-center sm:flex-col flex items-start justify-start bg-white border-gray-200 rounded-lg shadow-sm p-4 gap-5 ">
              <h1>Voting url</h1>
              <a
                href={`/${contest._id}/vote`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {`${window.location.origin}/${contest._id}/vote`}
              </a>
            </div>
          )}
        </div>
      </div>

      {contest.contestants && contest.contestants.length > 0 ? (
        <div className="space-y-4">
          {hasEnded && contest.contestants.some((c) => c.isWinner) && (
            <div className="flex items-center gap-2 bg-yellow-200 text-yellow-800 p-4 rounded-lg shadow-md">
              <Trophy className="h-6 w-6" />
              <span className="font-medium">
                Contest ended - Winner
                {contest.contestants.filter((c) => c.isWinner).length > 1
                  ? "s"
                  : ""}{" "}
                announced!
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-center">
          No contestants yet. Add contestants to get started!
        </div>
      )}
    </div>
  );
};

export default ContestItem;