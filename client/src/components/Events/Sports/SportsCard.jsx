import React from "react";
import { Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteEventSportsAPI } from "../../../Services/apiServices";
import toast from "react-hot-toast";

const SportsCard = ({
  name,
  image,
  onEdit,
  event,
  eventSportsId,
  fetchEventDetails,
}) => {
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

  return (
    <div className="w-40 h-40 bg-customPurple rounded-lg shadow-md flex items-center justify-center m-4 overflow-hidden relative group">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
        <p className="text-sm text-center font-bold text-white mb-2">{name}</p>
        <div className="flex justify-center space-x-2">
          <div className="hover:bg-white rounded-sm ">
            <Button
              icon={<EditOutlined className=" hover:text-blue-400" />}
              onClick={onEdit}
              type="text"
              size="small"
              className="text-white border-none shadow-none"
            />
          </div>
          <div className="hover:bg-white rounded-sm">
            <Popconfirm
              title="Are you sure you want to delete this sport?"
              onConfirm={onDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined className=" hover:text-red-400" />}
                type="text"
                size="small"
                className="text-white  border-none shadow-none"
              />
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsCard;
