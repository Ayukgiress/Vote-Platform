import React, { useState } from "react";
import ContestModal from "../../Components/Modals/ContestModal";
import AddContestantModal from "../../Components/Modals/Contestants";
import { Plus } from "lucide-react";
import axios from "axios";

const Overview = () => {
  const [contests, setContests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);

  const handleAddContestant = (contestId) => {
    setSelectedContestId(contestId);
    setIsContestantModalOpen(true);
  };

  const handleContestantAdded = (newContestant) => {
    setContests((prevContests) =>
      prevContests.map((contest) =>
        contest._id === selectedContestId
          ? { ...contest, contestants: [...contest.contestants, newContestant] }
          : contest
      )
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

 

  const handleCreateContest = async (contestData) => {
    try {
      const formData = new FormData();

      formData.append("name", contestData.name);
      formData.append("description", contestData.description);
      formData.append("startDate", contestData.startDate);
      formData.append("endDate", contestData.endDate);

      if (contestData.coverPhoto) {
        formData.append("coverPhoto", contestData.coverPhoto);
      }

      formData.append("contestants", JSON.stringify([]));

      // Debug log
      for (let pair of formData.entries()) {
        console.log(
          "FormData entry:",
          pair[0],
          pair[1] instanceof File
            ? `File: ${pair[1].name} (${pair[1].type})`
            : pair[1]
        );
      }

      const response = await axios.post(
        "http://localhost:5000/contests",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setContests((prev) => [...prev, response.data.data]);
        setIsModalOpen(false);
        alert("Contest created successfully!");
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      alert(
        "Failed to create contest: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Contest</span>
        </button>
      </div>

      <div className="w-full space-y-4">
        {contests.length > 0 ? (
          contests.map((contest) => (
            // Use _id instead of id, or use a fallback with index
            <div
              key={contest._id || contest.id || Math.random()}
              className="border p-4 rounded-lg shadow-lg"
            >
              <img
                src={`http://localhost:5000/${contest.coverPhotoUrl}`} // Make sure this points to the correct file
                alt="Cover Photo"
                className="w-96 h-80"
              />
              <h2 className="text-xl font-semibold">{contest.name}</h2>
              <p>{contest.description}</p>
              <p className="text-sm text-gray-600">
                {contest.startDate} - {contest.endDate}
              </p>

              <div className="mt-4">
                <h3 className="font-medium">Contestants</h3>
                {contest.contestants?.length > 0 ? (
                  <ul className="space-y-2 mt-2">
                    {contest.contestants.map((contestant, index) => (
                      <li
                        key={`${contest._id}-contestant-${index}`}
                        className="flex justify-between items-center"
                      >
                        <span>{contestant.name}</span>
                        {contestant.photoUrl && (
                          <img
                            src={contestant.photoUrl}
                            alt={contestant.name}
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No contestants yet.</p>
                )}
              </div>

              <div
                onClick={() => handleAddContestant(contest._id || contest.id)}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md"
              >
                <div
                  onClick={() => handleAddContestant(contest._id || contest.id)}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md cursor-pointer"
                >
                  Add Contestant
                </div>
                <AddContestantModal
                  isOpen={isContestantModalOpen}
                  onClose={() => setIsContestantModalOpen(false)}
                  contestId={selectedContestId}
                  onAddContestant={handleContestantAdded}
                />{" "}
              </div>
            </div>
          ))
        ) : (
          <p>No contests available. Create a new contest!</p>
        )}
      </div>

      <ContestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateContest}
      />
    </div>
  );
};

export default Overview;
