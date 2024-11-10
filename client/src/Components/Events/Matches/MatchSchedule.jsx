import React, { useState } from "react";

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Add Schedule button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Match Schedule</h1>
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Match Schedule
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sport Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Sport
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.sport}
                    onChange={(e) =>
                      setFormData({ ...formData, sport: e.target.value })
                    }
                  >
                    <option value="">Select a sport</option>
                    {sports.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teams Selection */}
                {formData.teams.map((team, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team 1
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={team.team1}
                          onChange={(e) => {
                            const newTeams = [...formData.teams];
                            newTeams[index].team1 = e.target.value;
                            setFormData({ ...formData, teams: newTeams });
                          }}
                        >
                          <option value="">Select team 1</option>
                          {formData.sport &&
                            teams[formData.sport].map((team) => (
                              <option key={team} value={team}>
                                {team}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team 2
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={team.team2}
                          onChange={(e) => {
                            const newTeams = [...formData.teams];
                            newTeams[index].team2 = e.target.value;
                            setFormData({ ...formData, teams: newTeams });
                          }}
                        >
                          <option value="">Select team 2</option>
                          {formData.sport &&
                            teams[formData.sport].map((team) => (
                              <option key={team} value={team}>
                                {team}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Date, Time and Venue for each match */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time
                        </label>
                        <input
                          type="time"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Venue
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter venue"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Matches Button */}
                <button
                  type="button"
                  onClick={handleAddTeamFields}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
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
                  <span>Add Another Match</span>
                </button>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Save Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchSchedule;
