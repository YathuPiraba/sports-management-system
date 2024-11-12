import React, { useState, useEffect } from "react";
import { matchSchedulesDataAPI } from "../../../Services/apiServices";
import { Button } from "antd";
import toast from "react-hot-toast";

const AddResultModal = ({ isOpen, onClose, onSubmit, eventId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    selectedDate: "",
    selectedMatch: null,
    team1Score: "",
    team2Score: "",
    winner: "",
  });

  // Fetch match schedules from the API
  const fetchMatchSchedule = async () => {
    setLoading(true);
    try {
      const res = await matchSchedulesDataAPI(eventId);
      setMatches(res.data.data.matches); // Set fetched matches
      console.log(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching match schedules list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchMatchSchedule(); // Fetch the match schedules when the eventId changes
    }
  }, [eventId]);

  // Group matches by date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {});

  const dates = Object.keys(matchesByDate).sort(); // Sort dates

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
            {formData?.selectedDate && (
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
                  {matchesByDate[formData.selectedDate]?.map((match, idx) => (
                    <option key={idx} value={JSON.stringify(match)}>
                      {`${match.sport}: ${match.club1?.name} vs ${match?.club2?.name} - ${match.time}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Score Input */}
            {formData?.selectedMatch && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.selectedMatch.club1.name} Score
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
                    {formData?.selectedMatch?.club2?.name} Score
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
                  <option value={formData.selectedMatch.club1.name}>
                    {formData.selectedMatch.club1.name}
                  </option>
                  <option value={formData.selectedMatch.club2.name}>
                    {formData.selectedMatch.club2.name}
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
