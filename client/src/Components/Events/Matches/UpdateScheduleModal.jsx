import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";
import { updateMatchSchedulesAPI } from "../../../Services/apiServices";

const UpdateScheduleModal = ({
  isOpen,
  onClose,
  fetchMatchSchedule,
  getMatchSchedule,
  matchData, // This now contains the data of the match (including clubs)
}) => {
  const [updatedMatchData, setUpdatedMatchData] = useState({
    home_club_id: matchData?.home_club_id,
    away_club_id: matchData?.away_club_id,
    match_date: matchData?.event_start_date,
    time: matchData?.time,
    venue: matchData?.place, // Assuming 'place' is the venue
  });

  useEffect(() => {
    setUpdatedMatchData({
      home_club_id: matchData?.home_club_id,
      away_club_id: matchData?.away_club_id,
      match_date: matchData?.event_start_date,
      time: matchData?.time,
      venue: matchData?.place,
    });
  }, [matchData]);

  const handleInputChange = (field, value) => {
    setUpdatedMatchData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await updateMatchSchedulesAPI(
        matchData.id,
        updatedMatchData
      );
      toast.success("Match schedule updated successfully");
      onClose();
      fetchMatchSchedule();
      getMatchSchedule();
    } catch (error) {
      console.error(error);
      toast.error("Error updating match schedule");
    }
  };

  return (
    <Modal
      title="Update Match Schedule"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Update
        </Button>,
      ]}
    >
      <div className="space-y-4">
        {/* Home Club (Read-only input) */}
        <div className="flex items-center justify-between">
          <label htmlFor="home-club" className="font-medium text-gray-700">
            Home Club
          </label>
          <div className="w-3/4">
            <input
              id="home-club"
              value={matchData?.club1?.name || ""}
              disabled
              className="bg-gray-100 border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        {/* Away Club (Read-only input) */}
        <div className="flex items-center justify-between">
          <label htmlFor="away-club" className="font-medium text-gray-700">
            Away Club
          </label>
          <div className="w-3/4">
            <input
              id="away-club"
              value={matchData?.club2?.name || ""}
              disabled
              className="bg-gray-100 border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        {/* Match Date */}
        <div className="flex items-center justify-between">
          <label htmlFor="match-date" className="font-medium text-gray-700">
            Match Date
          </label>
          <div className="w-3/4">
            <input
              type="date"
              id="match-date"
              value={updatedMatchData.match_date || ""}
              onChange={(e) => handleInputChange("match_date", e.target.value)}
              className="bg-gray-100 border-gray-300 rounded-md w-full"
              min={matchData?.event_start_date}
              max={matchData?.event_end_date}
            />
          </div>
        </div>

        {/* Match Time */}
        <div className="flex items-center justify-between">
          <label htmlFor="match-time" className="font-medium text-gray-700">
            Match Time
          </label>
          <div className="w-3/4">
            <input
              type="time"
              id="match-time"
              value={updatedMatchData.time || ""}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className="bg-gray-100 border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-center justify-between">
          <label htmlFor="venue" className="font-medium text-gray-700">
            Venue
          </label>
          <div className="w-3/4">
            <input
              id="venue"
              value={updatedMatchData.venue ||""}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              className="bg-gray-100 border-gray-300 rounded-md w-full"
              readOnly
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateScheduleModal;
