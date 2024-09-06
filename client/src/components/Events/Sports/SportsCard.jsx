import React from "react";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SportsCard = ({ name, image, onEdit, onDelete }) => (
  <div className="w-40 h-40 bg-customPurple rounded-lg shadow-md flex items-center justify-center m-4 overflow-hidden relative group">
    <img
      src={image}
      alt={name}
      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
      <p className="text-sm text-center font-bold text-white mb-2">{name}</p>
      <div className="flex justify-center space-x-2">
        <Button
          icon={<EditOutlined />}
          onClick={onEdit}
          type="text"
          size="small"
          className="text-white hover:text-blue-400 border-none shadow-none"
        />
        <Button
          icon={<DeleteOutlined />}
          onClick={onDelete}
          type="text"
          size="small"
          className="text-white hover:text-red-400 border-none shadow-none"
        />
      </div>
    </div>
  </div>
);

export default SportsCard;
