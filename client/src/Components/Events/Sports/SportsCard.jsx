import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteEventSportsAPI } from "../../../Services/apiServices";
import toast from "react-hot-toast";
import EventParticipantModal from "../EventParticipantModal";
import "../../../App.css";

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

const SportsCard = ({
  name,
  image,
  onEdit,
  event,
  eventSportsId,
  fetchEventDetails,
  role_id,
  sports_id,
  min_players,
  start_date,
  end_date,
  apply_due_date,
  place,
  participants,
  fetchClubEvents,
  applyLoading,
}) => {
  const [isParticipantModalVisible, setIsParticipantModalVisible] =
    useState(false);

  const handleParticipantModalOk = () => {
    setIsParticipantModalVisible(false);
    fetchClubEvents();
  };

  const handleParticipantModalCancel = () => {
    setIsParticipantModalVisible(false);
  };

  const onDelete = async () => {
    try {
      await deleteEventSportsAPI(event.id, eventSportsId);
      fetchEventDetails();
      toast.success("Event sport deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event sport.");
    }
  };

  const todayDate = formatDate(new Date());
  const dueDate = formatDate(apply_due_date);

  // Check if the eventSportsId is in the participants array
  const isApplied = participants?.some(
    (participant) => participant.id === eventSportsId
  );

  return (
    <div className="flex flex-col border bg-slate-100 rounded-md px-0.5">
      <div className="w-44 h-40 bg-gray-200 rounded-lg shadow-md relative group overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 flex flex-col justify-between bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          {/* Top Section */}
          <div className="p-1">
            <p className="text-xs font-bold text-white text-center">{name}</p>
          </div>

          {/* Middle Section */}
          <div className="px-2 flex-1">
            <div className="grid grid-cols-[auto,1fr] gap-x-1 text-[10px] text-white">
              <p className="font-medium whitespace-nowrap">Start:</p>
              <p className="text-right">{start_date}</p>
              <p className="font-medium whitespace-nowrap">End:</p>
              <p className="text-right">{end_date}</p>
              <p className="font-medium whitespace-nowrap">Place:</p>
              <p className="text-right">{place}</p>
            </div>
          </div>

          {/* Bottom Section - Actions */}
          <div className="flex justify-center p-1 space-x-1">
            {role_id === 1 && (
              <div className="flex space-x-1">
                <button
                  onClick={onEdit}
                  className="p-1 rounded hover:bg-white/20 transition-colors"
                >
                  <EditOutlined className="h-3 w-3 text-white" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 rounded hover:bg-white/20 transition-colors"
                >
                  <DeleteOutlined className="h-3 w-3 text-white" />
                </button>
              </div>
            )}

            {role_id === 2 && (
              <div>
                {isApplied ? (
                  <Button
                    variant="secondary"
                    className="h-5 text-[10px] px-2 bg-gray-400 text-white"
                    disabled
                  >
                    Applied
                  </Button>
                ) : (
                  todayDate <= dueDate && (
                    <Button
                      variant="secondary"
                      className="h-5 text-[10px] px-2 bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => setIsParticipantModalVisible(true)}
                      disabled={applyLoading}
                    >
                      Apply
                    </Button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Apply Due Date Outside the Image */}
      <p
        className={`text-center font-semibold mt-0 transition-transform duration-300 pb-2 ${
          todayDate <= dueDate
            ? "animate-zoom-in text-green-500"
            : "animate-zoom-out text-red-500"
        }`}
      >
        {todayDate <= dueDate
          ? `Apply Due Date: ${apply_due_date}`
          : `Apply Due Date Passed !!!`}
      </p>

      {/* EventParticipantModal for applying */}
      <EventParticipantModal
        name={name}
        open={isParticipantModalVisible}
        onOk={handleParticipantModalOk}
        onCancel={handleParticipantModalCancel}
        eventSportsId={eventSportsId}
        sports_id={sports_id}
        min_players={min_players}
      />
    </div>
  );
};

export default SportsCard;
