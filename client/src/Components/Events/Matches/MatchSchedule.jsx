import React, { useState } from "react";
import AddScheduleModal from "./AddScheduleModal";

const MatchSchedule = ({ roleId, eventId }) => {
  const [matches, setMatches] = useState([
    {
      date: "November 12, 2024",
      sport: "Football",
      sportImage: "/api/placeholder/80/80",
      club1: {
        name: "Manchester United",
        image: "/api/placeholder/64/64",
      },
      club2: {
        name: "Chelsea",
        image: "/api/placeholder/64/64",
      },
      time: "20:00",
      venue: "Old Trafford",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sport: "",
    teams: [{ team1: "", team2: "" }],
    date: "",
    time: "",
    venue: "",
  });

  // Sample data - in real app, this would come from API
  const sports = ["Football", "Basketball", "Cricket", "Tennis"];
  const teams = {
    Football: ["Manchester United", "Chelsea", "Liverpool", "Arsenal"],
    Basketball: ["Lakers", "Bulls", "Warriors", "Celtics"],
    Cricket: ["India", "Australia", "England", "South Africa"],
    Tennis: ["Individual Sport"],
  };

  const handleAddTeamFields = () => {
    setFormData((prev) => ({
      ...prev,
      teams: [...prev.teams, { team1: "", team2: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsModalOpen(false);
  };

  const handleSave = (newMatch) => {
    setMatches([...matches, newMatch]);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Add Schedule button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Match Schedule</h1>
        {roleId === 1 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Add Schedule</span>
          </button>
        )}
      </div>

      {/* Match Cards */}
      {matches.map((match, index) => (
        <div key={index} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {match.date}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex items-center space-x-4">
              <img
                src={match.sportImage}
                alt={match.sport}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-lg font-medium text-gray-700">
                {match.sport}
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={match.club1.image}
                    alt={match.club1.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-800">
                    {match.club1.name}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-700">VS</span>
                  <span className="text-sm text-gray-500 mt-2">
                    {match.time}
                  </span>
                  <span className="text-sm text-gray-500">{match.venue}</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={match.club2.image}
                    alt={match.club2.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-800">
                    {match.club2.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {roleId === 1 && (
        <AddScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sports={sports}
          teams={teams}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MatchSchedule;
