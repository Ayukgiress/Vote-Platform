import React, { useState, useEffect } from "react";
import ContestModal from "../../Components/Modals/ContestModal";
import AddContestantModal from "../../Components/Modals/Contestants";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../Contexts/AuthContext";
import { CopyToClipboard } from "react-copy-to-clipboard"; // Importing the Clipboard package

const Overview = () => {
  const { currentUser, currentUserLoading, isAuthenticated } = useAuth();
  const [contests, setContests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [publishedContests, setPublishedContests] = useState(new Set());

  // Fetch contests when the component mounts or when authentication state changes
  const fetchContests = async () => {
    if (currentUserLoading || !isAuthenticated || !currentUser?._id) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/contests/${currentUser._id}`, // Updated to localhost
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setContests(response.data.data);
        const publishedSet = new Set(
          response.data.data
            .filter(contest => contest.isPublished)
            .map(contest => contest._id)
        );
        setPublishedContests(publishedSet);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch contests");
    }
  };

  // Handle publish/unpublish contest status
  const handlePublishToggle = async (contestId) => {
    try {
      const token = localStorage.getItem("token");
      const isPublished = !publishedContests.has(contestId);

      const response = await axios.patch(
        `http://localhost:5000/contests/${contestId}/publish`, // Updated to localhost
        { isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPublishedContests(prev => {
          const newSet = new Set(prev);
          isPublished ? newSet.add(contestId) : newSet.delete(contestId);
          return newSet;
        });
        toast.success(isPublished ? "Contest published!" : "Contest unpublished");
      }
    } catch (error) {
      toast.error("Failed to update contest status");
    }
  };

  // Create a new contest
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
        "http://localhost:5000/contests", // Updated to localhost
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setContests(prev => [...prev, response.data.data]);
        setIsModalOpen(false);
        toast.success("Contest created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create contest");
    }
  };

  // UseEffect hook to fetch contests on mount and when authentication changes
  useEffect(() => {
    fetchContests();
  }, [currentUser, currentUserLoading, isAuthenticated]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-6 space-y-6 overflow-auto w-[102rem]">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-custom-blue text-white py-2 px-6 rounded-md flex items-center gap-2 shadow-lg hover:bg-custom-first transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Create Contest</span>
        </button>
      </div>

      <div className="w-full space-y-8">
        {contests.map((contest) => (
          <div
            key={contest._id}
            className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:scale-105 border border-gray-200"
          >
            <div className="overflow-hidden rounded-xl mb-6">
              <img
                src={`http://localhost:5000/${contest.coverPhotoUrl}`} // Updated to localhost
                alt="Cover"
                className="w-full h-56 object-cover rounded-xl transform hover:scale-105 transition-all duration-500"
              />
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-2xl font-semibold text-gray-900">{contest.name}</h2>
              <p className="text-sm text-gray-600">{contest.description}</p>

              <div className="flex justify-center gap-6 mt-6">
                <div className="flex flex-col items-center bg-gray-200 p-4 rounded-lg shadow-md">
                  <h1 className="text-xs font-medium text-gray-700">Start Date</h1>
                  <p className="text-sm text-gray-500">{contest.startDate}</p>
                </div>
                <div className="flex flex-col items-center bg-gray-200 p-4 rounded-lg shadow-md">
                  <h1 className="text-xs font-medium text-gray-700">End Date</h1>
                  <p className="text-sm text-gray-500">{contest.endDate}</p>
                </div>
              </div>
            </div>

            {publishedContests.has(contest._id) && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Voting URL:</p>
                  <p className="text-blue-600 break-all">
                    {`${window.location.origin}/vote/${contest._id}`}
                  </p>
                </div>
                <CopyToClipboard text={`${window.location.origin}/vote/${contest._id}`}>
                  <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Copy URL
                  </button>
                </CopyToClipboard>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              {!publishedContests.has(contest._id) && (
                <button
                  onClick={() => {
                    setSelectedContestId(contest._id);
                    setIsContestantModalOpen(true);
                  }}
                  className="flex-1 bg-custom-second text-white py-2 px-6 rounded-md shadow-lg hover:bg-custom-fourth transition-all duration-200"
                >
                  Add Contestant
                </button>
              )}

              <button
                onClick={() => handlePublishToggle(contest._id)}
                className={`flex-1 py-2 px-6 rounded-md shadow-lg transition-all duration-200 ${
                  publishedContests.has(contest._id)
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {publishedContests.has(contest._id) ? "Unpublish" : "Publish"}
              </button>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-lg text-gray-800">Contestants</h3>
              {contest.contestants?.length > 0 ? (
                <ul className="space-y-3 mt-3">
                  {contest.contestants.map((contestant, index) => (
                    <li key={index} className="flex justify-between items-center space-x-4">
                      <div className="flex items-center gap-3">
                        {contestant.photoUrl && (
                          <img
                            src={contestant.photoUrl.startsWith("http")
                              ? contestant.photoUrl
                              : `http://localhost:5000${contestant.photoUrl}`} 
                            alt={contestant.name}
                            className="h-32 w-32 rounded-full border-4 border-white shadow-md"
                          />
                        )}
                        <span className="text-gray-700 font-medium">{contestant.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No contestants yet.</p>
              )}
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
          setContests(prevContests =>
            prevContests.map(contest =>
              contest._id === selectedContestId
                ? { ...contest, contestants: [...contest.contestants, newContestant] }
                : contest
            )
          );
        }}
      />
    </div>
  );
};

export default Overview;
