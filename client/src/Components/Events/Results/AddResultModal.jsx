import React, { useState } from "react";
import {
  submitMatchResultAPI,
  updateMatchResultsAPI,
} from "../../../Services/apiServices";
import { Button } from "antd";
import toast from "react-hot-toast";

const AddResultModal = ({
  isOpen,
  onClose,
  matches,
  loading,
  fetchMatchResults,
  fetchMatchStats,
}) => {
  const [formData, setFormData] = useState({
    selectedDate: "",
    selectedMatch: null,
    team1Score: "",
    team2Score: "",
    winner: "",
  });

  // Group matches by date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {});

  const dates = Object.keys(matchesByDate).sort();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Determine winner club id
      const winnerClubId =
        formData.winner === "Draw"
          ? null
          : formData.winner === formData.selectedMatch.club1.name
          ? formData.selectedMatch.club1.id
          : formData.selectedMatch.club2.id;

      const payload = {
        match_id: formData.selectedMatch.id,
        home_club_id: formData.selectedMatch.home_club_id,
        away_club_id: formData.selectedMatch.away_club_id,
        home_score: formData.team1Score,
        away_score: formData.team2Score,
        winner_club_id: winnerClubId,
      };

      const res = await submitMatchResultAPI(payload);

      toast.success("Match result submitted successfully");

      setFormData({
        selectedDate: "",
        selectedMatch: null,
        team1Score: "",
        team2Score: "",
        winner: "",
      });
      fetchMatchResults();
      fetchMatchStats();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit match result");
    }
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
                    {date}
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
                  {matchesByDate[formData.selectedDate]?.map((match) => (
                    <option key={match.id} value={JSON.stringify(match)}>
                      {`${match.sport}: ${match.club1.name} vs ${match.club2.name} - ${match.time}`}
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
                    {formData.selectedMatch.club2.name} Score
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
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-blue-600 next-btn hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Save Result
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddResultModal;
