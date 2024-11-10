import React, { useState } from "react";

const AddResultModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedDate: "",
    selectedMatch: null,
    team1Score: "",
    team2Score: "",
    winner: "",
  });

  const scheduledMatches = [
    {
      date: "2024-11-10",
      sport: "Football",
      team1: "Manchester United",
      team2: "Chelsea",
      time: "15:00",
      venue: "Old Trafford",
    },
    {
      date: "2024-11-10",
      sport: "Basketball",
      team1: "Lakers",
      team2: "Warriors",
      time: "19:30",
      venue: "Staples Center",
    },
    {
      date: "2024-11-11",
      sport: "Cricket",
      team1: "India",
      team2: "Australia",
      time: "14:00",
      venue: "MCG",
    },
    {
      date: "2024-11-12",
      sport: "Football",
      team1: "Liverpool",
      team2: "Arsenal",
      time: "20:00",
      venue: "Anfield",
    },
    {
      date: "2024-11-12",
      sport: "Tennis",
      team1: "Djokovic",
      team2: "Nadal",
      time: "16:00",
      venue: "Centre Court",
    },
  ];

  // Group matches by date
  const matchesByDate = scheduledMatches.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {});

  const dates = Object.keys(matchesByDate).sort();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData.selectedMatch,
      team1Score: formData.team1Score,
      team2Score: formData.team2Score,
      winner: formData.winner,
    });
    setFormData({
      selectedDate: "",
      selectedMatch: null,
      team1Score: "",
      team2Score: "",
      winner: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add Match Result
            </h2>
            <button
              onClick={onClose}
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

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.selectedDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    selectedDate: e.target.value,
                    selectedMatch: null,
                    team1Score: "",
                    team2Score: "",
                    winner: "",
                  })
                }
              >
                <option value="">Select a date</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Match Selection */}
            {formData.selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Match
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={
                    formData.selectedMatch
                      ? JSON.stringify(formData.selectedMatch)
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selectedMatch: e.target.value
                        ? JSON.parse(e.target.value)
                        : null,
                      team1Score: "",
                      team2Score: "",
                      winner: "",
                    })
                  }
                >
                  <option value="">Select a match</option>
                  {matchesByDate[formData.selectedDate].map((match, idx) => (
                    <option key={idx} value={JSON.stringify(match)}>
                      {`${match.sport}: ${match.team1} vs ${match.team2} - ${match.time}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Score Input */}
            {formData.selectedMatch && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.selectedMatch.team1} Score
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.team1Score}
                    onChange={(e) =>
                      setFormData({ ...formData, team1Score: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.selectedMatch.team2} Score
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.team2Score}
                    onChange={(e) =>
                      setFormData({ ...formData, team2Score: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Winner Selection */}
            {formData.team1Score && formData.team2Score && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Winner
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.winner}
                  onChange={(e) =>
                    setFormData({ ...formData, winner: e.target.value })
                  }
                >
                  <option value="">Select winner</option>
                  <option value={formData.selectedMatch.team1}>
                    {formData.selectedMatch.team1}
                  </option>
                  <option value={formData.selectedMatch.team2}>
                    {formData.selectedMatch.team2}
                  </option>
                  <option value="Draw">Draw</option>
                </select>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Save Result
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddResultModal;
