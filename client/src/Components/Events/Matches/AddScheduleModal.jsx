import React, { useState } from "react";

const AddScheduleModal = ({ isOpen, onClose, sports, teams, onSave }) => {
  const [formData, setFormData] = useState({
    sport: "",
    teams: [{ team1: "", team2: "", date: "", time: "" }],
    venue: "",
  });

  const handleAddTeamFields = () => {
    setFormData((prev) => ({
      ...prev,
      teams: [...prev.teams, { team1: "", team2: "", date: "", time: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Match Schedule
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
              {formData.teams.map((team, index) => (
                <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg">
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
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={team.date}
                        onChange={(e) => {
                          const newTeams = [...formData.teams];
                          newTeams[index].date = e.target.value;
                          setFormData({ ...formData, teams: newTeams });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={team.time}
                        onChange={(e) => {
                          const newTeams = [...formData.teams];
                          newTeams[index].time = e.target.value;
                          setFormData({ ...formData, teams: newTeams });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
    )
  );
};

export default AddScheduleModal;