import { Button } from "antd";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updateMatchResultsAPI } from "../../../Services/apiServices";

const EditResultsModal = ({
  isOpen,
  editingMatch,
  fetchMatchResults,
  fetchMatchStats,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    team1Score: "",
    team2Score: "",
    winner: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingMatch) {
      setFormData({
        team1Score: editingMatch.home_team?.score || "",
        team2Score: editingMatch.away_team?.score || "",
        winner:
          editingMatch.winner_id === editingMatch.home_team?.club_id
            ? editingMatch.home_team?.club_name
            : editingMatch.away_team?.club_name,
      });
    }
  }, [editingMatch]); // This will run when editingMatch changes

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare the payload
      const payload = {
        match_id: editingMatch?.match_id,
        home_club_id: editingMatch?.home_team?.club_id,
        away_club_id: editingMatch?.away_team?.club_id,
        home_score: formData.team1Score,
        away_score: formData.team2Score,
        winner_club_id:
          formData.winner === editingMatch?.home_team?.club_name
            ? editingMatch?.home_team?.club_id
            : editingMatch?.away_team?.club_id,
      };

      // Convert payload to JSON string before sending (optional step, depending on your API setup)
      const jsonPayload = JSON.stringify(payload);

      // Call the API with the JSON data
      const res = await updateMatchResultsAPI(
        editingMatch?.match_id,
        jsonPayload
      );

      toast.success("Match result updated successfully");

      // Reset form data after successful submission
      setFormData({
        team1Score: "",
        team2Score: "",
        winner: "",
      });

      // Re-fetch match data and close the modal
      fetchMatchResults();
      fetchMatchStats();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update match result");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Match Result
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingMatch?.home_team?.club_name} Score
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
                  {editingMatch?.away_team?.club_name} Score
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
                <option value={editingMatch?.home_team?.club_name}>
                  {editingMatch?.home_team?.club_name}
                </option>
                <option value={editingMatch?.away_team?.club_name}>
                  {editingMatch?.away_team?.club_name}
                </option>
                <option value="Draw">Draw</option>
              </select>
            </div>

            <div className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-blue-600 next-btn hover:bg-blue-700 text-white font-medium px-6 py-4 rounded-lg transition-colors duration-200"
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

export default EditResultsModal;
