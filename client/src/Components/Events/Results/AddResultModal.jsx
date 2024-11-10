import React, { useState } from "react";

const AddResultModal = ({ isOpen, onClose, onSubmit, teams, sports }) => {
  const [formData, setFormData] = useState({
    sport: "",
    team1: "",
    team2: "",
    team1Score: "",
    team2Score: "",
    date: "",
    venue: "",
    winner: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass formData back to the parent component
    setFormData({
      sport: "",
      team1: "",
      team2: "",
      team1Score: "",
      team2Score: "",
      date: "",
      venue: "",
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
            <h2 className="text-2xl font-bold text-gray-800">Add Match Result</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Sport</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value, team1: "", team2: "" })}
              >
                <option value="">Select a sport</option>
                {sports.filter((sport) => sport !== "All Sports").map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>

            {formData.sport && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team 1</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={formData.team1}
                    onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
                  >
                    <option value="">Select team 1</option>
                    {teams[formData.sport].map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team 2</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={formData.team2}
                    onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
                  >
                    <option value="">Select team 2</option>
                    {teams[formData.sport].filter((team) => team !== formData.team1).map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {formData.team1 && formData.team2 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{formData.team1} Score</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={formData.team1Score}
                    onChange={(e) => setFormData({ ...formData, team1Score: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{formData.team2} Score</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={formData.team2Score}
                    onChange={(e) => setFormData({ ...formData, team2Score: e.target.value })}
                  />
                </div>
              </div>
            )}

            {formData.team1Score && formData.team2Score && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Winner</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={formData.winner}
                  onChange={(e) => setFormData({ ...formData, winner: e.target.value })}
                >
                  <option value="">Select winner</option>
                  <option value={formData.team1}>{formData.team1}</option>
                  <option value={formData.team2}>{formData.team2}</option>
                  <option value="Draw">Draw</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={formData.venue}
                  placeholder="Enter venue"
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg">
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
