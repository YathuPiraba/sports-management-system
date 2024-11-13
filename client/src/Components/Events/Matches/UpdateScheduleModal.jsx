import { Button } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { updateMatchSchedulesAPI } from "../../../Services/apiServices";

const UpdateScheduleModal = ({
  isOpen,
  onClose,
  eventData,
  fetchMatchSchedule,
  getMatchSchedule,
  matchData,
}) => {
  console.log(matchData);

  const initialFormState = {
    event_sports_id: "",
    matches: [
      {
        home_club_id: "",
        away_club_id: "",
        match_date: "",
        time: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  // Transform eventData object into array for easier mapping
  const eventsArray = Object.values(eventData || {});

  const handleAddMatch = () => {
    setFormData((prev) => ({
      ...prev,
      matches: [
        ...prev.matches,
        { home_club_id: "", away_club_id: "", match_date: "", time: "" },
      ],
    }));
  };

  const handleRemoveMatch = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      matches: prev.matches.filter((_, index) => index !== indexToRemove),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate that all matches have both teams selected
      const isValid = formData.matches.every(
        (match) =>
          match.home_club_id &&
          match.away_club_id &&
          match.match_date &&
          match.time
      );

      if (!isValid) {
        throw new Error("Please fill in all match details");
      }

      if (!formData.event_sports_id) {
        throw new Error("Please select a tournament");
      }

      // Check that teams are different
      const hasInvalidMatch = formData.matches.some(
        (match) => match.home_club_id === match.away_club_id
      );

      if (hasInvalidMatch) {
        throw new Error("Home and away teams cannot be the same");
      }

      await addMatchScheduleAPI(formData.event_sports_id, formData);
      fetchMatchSchedule();
      getMatchSchedule();
      toast.success("Schedule saved successfully");
      handleClose();
    } catch (error) {
      // Display error messages from the API response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save schedule";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get clubs for selected tournament
  const getClubsForEvent = (eventSportId) => {
    const selectedEvent = eventsArray.find(
      (event) => event.event_sport_id == eventSportId
    );
    return selectedEvent ? selectedEvent.clubs : [];
  };

  // Get the start and end dates for the selected event
  const selectedEvent = eventsArray.find(
    (event) => event.event_sport_id == formData.event_sports_id
  );
  const eventStartDate = selectedEvent?.start_date || "";
  const eventEndDate = selectedEvent?.end_date || "";

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
                onClick={handleClose}
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
                  Select Tournament
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.event_sports_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      event_sports_id: e.target.value,
                      // Reset matches when tournament changes
                      matches: [
                        {
                          home_club_id: "",
                          away_club_id: "",
                          match_date: "",
                          time: "",
                        },
                      ],
                    })
                  }
                >
                  <option value="">Select a tournament</option>
                  {eventsArray.map((event) => (
                    <option
                      key={event.event_sport_id}
                      value={event.event_sport_id}
                    >
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
              {formData.matches.map((match, index) => (
                <div
                  key={index}
                  className="space-y-4 p-4 border border-gray-200 rounded-lg relative"
                >
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMatch(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Team
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={match.home_club_id}
                        onChange={(e) => {
                          const newMatches = [...formData.matches];
                          newMatches[index].home_club_id = e.target.value;
                          setFormData({ ...formData, matches: newMatches });
                        }}
                      >
                        <option value="">Select home team</option>
                        {formData.event_sports_id &&
                          getClubsForEvent(formData.event_sports_id).map(
                            (club) => (
                              <option key={club.club_id} value={club.club_id}>
                                {club.clubName}
                              </option>
                            )
                          )}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Away Team
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={match.away_club_id}
                        onChange={(e) => {
                          const newMatches = [...formData.matches];
                          newMatches[index].away_club_id = e.target.value;
                          setFormData({ ...formData, matches: newMatches });
                        }}
                      >
                        <option value="">Select away team</option>
                        {formData.event_sports_id &&
                          getClubsForEvent(formData.event_sports_id)
                            .filter(
                              (club) => club.club_id != match.home_club_id
                            )
                            .map((club) => (
                              <option key={club.club_id} value={club.club_id}>
                                {club.clubName}
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
                        value={match.match_date || ""}
                        min={eventStartDate}
                        max={eventEndDate}
                        onChange={(e) => {
                          const newMatches = [...formData.matches];
                          newMatches[index].match_date = e.target.value;
                          setFormData({ ...formData, matches: newMatches });
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
                        value={match.time || ""}
                        onChange={(e) => {
                          const newMatches = [...formData.matches];
                          newMatches[index].time = e.target.value;
                          setFormData({ ...formData, matches: newMatches });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMatch}
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
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-5 rounded-lg transition-colors duration-200 disabled:bg-blue-400"
                >
                  Save Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateScheduleModal;
