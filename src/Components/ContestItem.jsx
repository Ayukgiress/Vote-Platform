import React, { useState } from "react";
import {
  Trash2, Users, Trophy, Info, Calendar,
  Share2, Play, Pause, List
} from "lucide-react"; // Added 'List' icon for tabs
import ContestantItem from "./ContastantItem";
import API_URL from "../Pages/Constants/Constants";
import { useTheme } from "../Pages/Contexts/ThemeContext";

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
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("Overview"); // State for active tab
  
  const isPublished = publishedContests.has(contest._id);
  const hasEnded = new Date(contest.endDate) < new Date();

  /** --- STATUS BADGES --- **/
  const status = hasEnded ? "ended" : isPublished ? "active" : "draft";
  const statusText =
    status === "ended" ? "Ended" : status === "active" ? "Active" : "Draft";

  const statusStyles = {
    ended:
      theme === "dark"
        ? "bg-slate-600/20 text-slate-300"
        : "bg-gray-100 text-gray-700",
    active:
      theme === "dark"
        ? "bg-emerald-500/20 text-emerald-300"
        : "bg-green-100 text-green-700",
    draft:
      theme === "dark"
        ? "bg-amber-500/20 text-amber-300"
        : "bg-yellow-100 text-yellow-700",
  };
  
  // Define tabs
  const tabs = ["Overview", "Contestants"];
  if (isPublished && !hasEnded) {
      tabs.push("Voting");
  }

  const tabItemClass = (tab) => `
    px-4 py-2 text-sm font-medium rounded-t-lg transition cursor-pointer 
    ${activeTab === tab 
        ? theme === "dark" 
            ? "bg-white/10 text-sky-400 border-b-2 border-sky-400" 
            : "bg-slate-100 text-blue-600 border-b-2 border-blue-600"
        : theme === "dark" 
            ? "text-slate-400 hover:text-white" 
            : "text-slate-500 hover:text-slate-800"
    }
  `;

  return (
    <div
      className={`rounded-2xl shadow-lg border overflow-hidden transition hover:-translate-y-1 hover:shadow-xl ${
        theme === "dark"
          ? "bg-white/5 border-white/10 hover:border-sky-400/40"
          : "bg-white border-slate-200 hover:border-blue-300"
      }`}
    >
      {/** ---------------- HEADER ---------------- **/}
      <div className="p-5 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-slate-800"
              }`}
            >
              {contest.name}
            </h2>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}
            >
              {statusText}
            </span>
          </div>

          <p
            className={`text-sm ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {contest.contestants?.length || 0} contestants •{" "}
            {contest.contestants?.reduce(
              (t, c) => t + (c.votes || 0),
              0
            )}{" "}
            votes
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedContestId(contest._id);
              setIsContestantModalOpen(true);
            }}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Users size={16} />
            Add
          </button>

          {!hasEnded && (
            <button
              onClick={() => handlePublishToggle(contest._id)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                isPublished
                  ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-500/20 dark:hover:bg-yellow-500/30 dark:text-yellow-300"
                  : "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300"
              }`}
            >
              {isPublished ? <Pause size={16} /> : <Play size={16} />}
              {isPublished ? "Unpublish" : "Publish"}
            </button>
          )}

          <button
            onClick={() => handleDeleteContest(contest._id)}
            className={`p-2 rounded-xl ${
              theme === "dark"
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-300"
                : "bg-red-100 hover:bg-red-200 text-red-600"
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/** ---------------- TABS ---------------- **/}
      <div className="flex border-b border-white/10 px-5 pt-3">
          {tabs.map(tab => (
              <div 
                  key={tab} 
                  className={tabItemClass(tab)}
                  onClick={() => setActiveTab(tab)}
              >
                  {tab}
              </div>
          ))}
      </div>

      {/** ---------------- TAB CONTENT ---------------- **/}
      <div className="p-5">
        
        {/** --- 1. OVERVIEW TAB --- **/}
        {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* IMAGE */}
                <div className="rounded-xl overflow-hidden shadow-md">
                    <img
                        src={
                            contest.coverPhotoUrl.startsWith("https")
                                ? contest.coverPhotoUrl
                                : `${API_URL}/${contest.coverPhotoUrl.replace(/^\//, '')}`
                        }
                        alt={contest.name}
                        className="w-full h-56 object-cover"
                    />
                </div>

                {/** DETAILS (Description + Dates) **/}
                <div className="lg:col-span-2 space-y-4">
                    {/* DESCRIPTION */}
                    <div
                        className={`rounded-xl p-4 border ${
                            theme === "dark"
                                ? "bg-white/5 border-white/10"
                                : "bg-slate-50 border-slate-200"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <Info
                                size={20}
                                className={`${
                                    theme === "dark" ? "text-sky-400" : "text-blue-600"
                                } mt-1 flex-shrink-0`}
                            />
                            <div>
                                <h3
                                    className={`font-semibold mb-1 ${
                                        theme === "dark" ? "text-white" : "text-slate-800"
                                    }`}
                                >
                                    Description
                                </h3>
                                <p
                                    className={`text-sm ${
                                        theme === "dark" ? "text-slate-300" : "text-slate-600"
                                    }`}
                                >
                                    {contest.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DATES */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[["Start Date", contest.startDate, "green"], ["End Date", contest.endDate, "red"]].map(
                            ([label, date, color], i) => (
                                <div
                                    key={i}
                                    className={`rounded-xl p-4 border ${
                                        theme === "dark"
                                            ? "bg-white/5 border-white/10"
                                            : "bg-slate-50 border-slate-200"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-1">
                                        <div
                                            className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-500/20`}
                                        >
                                            <Calendar
                                                size={18}
                                                className={`text-${color}-600 dark:text-${color}-400`}
                                            />
                                        </div>
                                        <h4
                                            className={`font-semibold ${
                                                theme === "dark" ? "text-white" : "text-slate-800"
                                            }`}
                                        >
                                            {label}
                                        </h4>
                                    </div>
                                    <p
                                        className={`ml-10 text-sm ${
                                            theme === "dark" ? "text-slate-300" : "text-slate-600"
                                        }`}
                                    >
                                        {formatDate(date)}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        )}

        {/** --- 2. CONTESTANTS TAB --- **/}
        {activeTab === "Contestants" && (
            <>
                {/** WINNER BADGE */}
                {hasEnded && contest.contestants?.some((c) => c.isWinner) && (
                    <div
                        className={`rounded-xl p-4 mb-5 flex items-center gap-3 border ${
                            theme === "dark"
                                ? "bg-amber-500/20 border-amber-400/30"
                                : "bg-yellow-50 border-yellow-200"
                        }`}
                    >
                        <Trophy className="text-yellow-600 dark:text-amber-300" />
                        <span
                            className={`font-semibold ${
                                theme === "dark" ? "text-amber-200" : "text-yellow-800"
                            }`}
                        >
                            Contest ended — winner announced
                        </span>
                    </div>
                )}
                
                <h3
                    className={`text-lg font-bold mb-4 ${
                        theme === "dark" ? "text-white" : "text-slate-800"
                    }`}
                >
                    Contestants ({contest.contestants?.length || 0})
                </h3>

                {contest.contestants?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {contest.contestants.map((c) => (
                            <ContestantItem
                                key={c._id}
                                contestant={c}
                                contest={contest}
                                handleVote={handleVote}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className={`rounded-xl p-10 text-center border ${
                            theme === "dark"
                                ? "bg-white/5 border-white/10"
                                : "bg-slate-50 border-slate-200"
                        }`}
                    >
                        <Users className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                        <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                            No contestants yet.
                        </p>
                    </div>
                )}
            </>
        )}

        {/** --- 3. VOTING TAB --- **/}
        {activeTab === "Voting" && isPublished && !hasEnded && (
            <div
                className={`rounded-xl p-6 border flex items-start gap-4 ${
                    theme === "dark"
                        ? "bg-sky-500/10 border-sky-400/30"
                        : "bg-blue-50 border-blue-200"
                }`}
            >
                <Share2
                    size={20}
                    className={`${
                        theme === "dark" ? "text-sky-400" : "text-blue-600"
                    } mt-1 flex-shrink-0`}
                />
                <div>
                    <h4
                        className={`text-lg font-semibold mb-1 ${
                            theme === "dark" ? "text-sky-300" : "text-blue-700"
                        }`}
                    >
                        Public Voting Link
                    </h4>
                    <p
                        className={`mb-3 ${
                            theme === "dark" ? "text-slate-300" : "text-slate-600"
                        }`}
                    >
                        Share this link with your audience so they can cast their votes.
                    </p>
                    <a
                        href={`/vote/${contest._id}`}
                        target="_blank"
                        className={`text-sm break-all font-mono p-2 rounded-lg inline-block hover:underline ${
                            theme === "dark" 
                                ? "text-sky-400 bg-white/5 border border-white/10" 
                                : "text-blue-600 bg-white border border-blue-200"
                        }`}
                    >
                        {window.location.origin}/vote/{contest._id}
                    </a>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ContestItem;