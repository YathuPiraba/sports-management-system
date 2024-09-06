import React from "react";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SportsCard = ({ name, image, onEdit, onDelete }) => (
  <div className="w-40 h-40 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center m-4 overflow-hidden relative group">
    {/* Image with object-fit */}
    <img
      src={image}
      alt={name}
      className="bg-cover p-2 transition-transform duration-300 ease-in-out"
    />
    {/* Hidden by default, visible on hover */}
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
      <p className="text-sm text-center font-bold hover:bg-white px-1 hover:text-blue-500 cursor-pointer rounded-sm text-white">
        {name}
      </p>
      <div className="flex justify-center space-x-2 mt-2">
        <Button
          icon={<EditOutlined />}
          onClick={onEdit}
          className="text-white bg-transparent border-none shadow-none hover:bg-transparent"
          size="small"
        />
        <Button
          icon={<DeleteOutlined />}
          onClick={onDelete}
          className="text-white bg-transparent border-none shadow-none hover:bg-transparent"
          size="small"
        />
      </div>
    </div>
  </div>
);

export default SportsCard;
