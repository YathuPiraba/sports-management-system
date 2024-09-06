import React from "react";
import { PlusOutlined } from "@ant-design/icons";

const AddSportsCard = ({ onClick }) => (
  <div
    className="w-40 h-40 bg-customPurple rounded-lg shadow-md flex flex-col items-center justify-center m-4 cursor-pointer overflow-hidden relative"
    onClick={onClick}
  >
    <div className="z-10 flex flex-col items-center justify-center h-full w-full">
      <PlusOutlined className="text-4xl text-white mb-2" />
      <p className="text-sm text-center font-bold text-gray-200">Add Sport</p>
    </div>
  </div>
);

export default AddSportsCard;
