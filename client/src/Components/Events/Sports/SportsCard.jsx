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
      <div className="w-44 h-40 bg-customPurple rounded-lg shadow-md flex items-center justify-center mx-4 mt-4 mb-2 overflow-hidden relative group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <p className="text-sm text-center font-bold text-white mb-2">
            {name}
          </p>
          {/* Display Start and End Date */}
          <div className="grid grid-cols-2 text-xs text-white gap-y-1 pl-2 mb-2">
            {/* Start Date */}
            <p className="font-medium">Start Date:</p>
            <p>{start_date}</p>

            {/* End Date */}
            <p className="font-medium">End Date:</p>
            <p>{end_date}</p>

            {/* Place */}
            <p className="font-medium">Place:</p>
            <p>{place}</p>
          </div>
          <div className="flex justify-center space-x-2">
            {role_id === 1 && (
              <>
                <div className="hover:bg-white rounded-sm">
                  <Button
                    icon={<EditOutlined className="hover:text-blue-400" />}
                    onClick={onEdit}
                    type="text"
                    size="small"
                    className="text-white border-none shadow-none"
                  />
                </div>
                <div className="hover:bg-white rounded-sm">
                  <Popconfirm
                    title="Are you sure you want to delete this event-sport?"
                    onConfirm={onDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      icon={<DeleteOutlined className="hover:text-red-400" />}
                      type="text"
                      size="small"
                      className="text-white border-none shadow-none"
                    />
                  </Popconfirm>
                </div>
              </>
            )}
            {role_id === 2 && (
              <div className="hover:bg-green-500 rounded-md">
                {/* Apply Button Conditional Rendering */}
                {isApplied ? (
                  <Button
                    type="text"
                    className="bg-gray-400 !text-white"
                    disabled
                  >
                    Applied
                  </Button>
                ) : (
                  todayDate <= dueDate && (
                    <Button
                      type="text"
                      className="bg-green-400 !text-white"
                      onClick={() => setIsParticipantModalVisible(true)}
                      loading={applyLoading}
                    >
                      Apply
                    </Button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        {role_id === 2 && (
          <EventParticipantModal
            open={isParticipantModalVisible}
            sports_id={sports_id}
            onCancel={handleParticipantModalCancel}
            onOk={handleParticipantModalOk}
            min_players={min_players}
            name={name}
            eventSportsId={eventSportsId}
          />
        )}
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
    </div>
  );
};

export default SportsCard;
