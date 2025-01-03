import React, { useState, useEffect } from "react";
import ContestModal from "../../Components/Modals/ContestModal";
import AddContestantModal from "../../Components/Modals/Contestants";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../Contexts/AuthContext";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Overview = () => {
  const { currentUser, currentUserLoading, isAuthenticated } = useAuth();
  const [contests, setContests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [publishedContests, setPublishedContests] = useState(new Set());

  const fetchContests = async () => {
    if (currentUserLoading || !isAuthenticated || !currentUser?._id) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/contests/${currentUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setContests(response.data.data);
        const publishedSet = new Set(
          response.data.data
            .filter((contest) => contest.isPublished)
            .map((contest) => contest._id)
        );
        setPublishedContests(publishedSet);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch contests");
    }
  };

  const handlePublishToggle = async (contestId) => {
    const contest = contests.find((c) => c._id === contestId);
    if (!contest || contest.contestants.length === 0) {
      toast.error("Contest must have at least one contestant to be published");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const isPublished = !publishedContests.has(contestId);

      const response = await axios.patch(
        `http://localhost:5000/contests/${contestId}/publish`,
        { isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPublishedContests((prev) => {
          const newSet = new Set(prev);
          isPublished ? newSet.add(contestId) : newSet.delete(contestId);
          return newSet;
        });
        toast.success(
          isPublished ? "Contest published!" : "Contest unpublished"
        );
      }
    } catch (error) {
      toast.error("Failed to update contest status");
    }
  };

  const handleCreateContest = async (contestData) => {
    if (currentUserLoading || !isAuthenticated) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append("name", contestData.name);
      formData.append("description", contestData.description);
      formData.append("startDate", contestData.startDate);
      formData.append("endDate", contestData.endDate);
      formData.append("userId", currentUser._id);

      if (contestData.coverPhoto) {
        formData.append("coverPhoto", contestData.coverPhoto);
      }

      const response = await axios.post(
        "http://localhost:5000/contests",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setContests((prev) => [...prev, response.data.data]);
        setIsModalOpen(false);
        toast.success("Contest created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create contest");
    }
  };

  useEffect(() => {
    fetchContests();
  }, [currentUser, currentUserLoading, isAuthenticated]);

  return (
    <div className="flex flex-col h-lvh bg-gray-50 p-6 space-y-6 overflow-auto w-full xl:w-[102rem] 3xl:w-[138rem]">
      <div className="flex items-center justify-between w-full gap-3">
        <h1 className="text-xl font-bold text-gray-800"> Overview</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-custom-blue text-white py-3 px-8 rounded-md flex items-center gap-1 shadow-lg hover:bg-custom-blue transition-all duration-300"
        >
          <Plus className="h-3 w-5" />
          <span className="text-sm">Create Contest</span>
        </button>
      </div>

      <div className="w-full space-y-8">
        {contests.map((contest) => (
          <div
            key={contest._id}
            className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={`http://localhost:5000/${contest.coverPhotoUrl}`}
                    alt="Cover"
                    className="w-full h-72 object-cover rounded-xl transform hover:scale-105 transition-duration-300"
                  />
                </div>

                <div className="flex items-start justify-start gap-5 flex-col">
                  <div className="flex items-start justify-start flex-col">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {contest.name}
                    </h2>
                    <p className="mt-2 text-gray-600">{contest.description}</p>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h1 className="text-sm font-medium text-gray-700">
                        Start Date
                      </h1>
                      <p className="text-gray-600">{contest.startDate}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h1 className="text-sm font-medium text-gray-700">
                        End Date
                      </h1>
                      <p className="text-gray-600">{contest.endDate}</p>
                    </div>
                  </div>
                </div>

                {publishedContests.has(contest._id) && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Voting URL
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/vote/${contest._id}`}
                        className="flex-1 text-sm bg-white p-2 rounded border"
                      />
                      <CopyToClipboard
                        text={`${window.location.origin}/vote/${contest._id}`}
                      >
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                          Copy
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-gray-800 mb-4">
                    Contestants
                  </h3>
                  {contest.contestants?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contest.contestants.map((contestant, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg overflow-hidden flex"
                        >
                          {contestant.photoUrl && (
                            <img
                              src={
                                contestant.photoUrl.startsWith("http")
                                  ? contestant.photoUrl
                                  : `http://localhost:5000${contestant.photoUrl}`
                              }
                              alt={contestant.name}
                              className="w-24 h-24 object-cover"
                            />
                          )}
                          <div className="p-4 flex-1">
                            <h4 className="font-medium text-gray-900">
                              {contestant.name}
                            </h4>
                            <div className="mt-1 flex justify-between text-sm">
                              {contestant.votes && (
                                <span className="text-blue-600">
                                  {contestant.votes} votes
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No contestants yet.</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  {!publishedContests.has(contest._id) && (
                    <button
                      onClick={() => {
                        setSelectedContestId(contest._id);
                        setIsContestantModalOpen(true);
                      }}
                      className="flex-1 bg-custom-blue text-white py-2 px-4 rounded-md hover:bg-custom-blue"
                    >
                      Add Contestant
                    </button>
                  )}
                  <button
                    onClick={() => handlePublishToggle(contest._id)}
                    className={`flex-1 py-2 px-4 rounded-md ${
                      publishedContests.has(contest._id)
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    {publishedContests.has(contest._id)
                      ? "Unpublish"
                      : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ContestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateContest}
      />
      <AddContestantModal
        isOpen={isContestantModalOpen}
        onClose={() => setIsContestantModalOpen(false)}
        contestId={selectedContestId}
        onAddContestant={(newContestant) => {
          setContests((prevContests) =>
            prevContests.map((contest) =>
              contest._id === selectedContestId
                ? {
                    ...contest,
                    contestants: [...contest.contestants, newContestant],
                  }
                : contest
            )
          );
        }}
      />
    </div>
  );
};

export default Overview;
