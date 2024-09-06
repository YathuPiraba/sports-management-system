import React from "react";
import { PlusOutlined } from "@ant-design/icons";

const AddSportsCard = ({ onClick }) => (
  <div
    className="w-40 h-40 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center m-4 cursor-pointer overflow-hidden relative bg-white"
    onClick={onClick}
  >
    <div className="absolute top-0 left-0 right-0 h-[40%] rounded-t-full"></div>
    <div className="absolute bottom-0 left-0 right-0 h-[40%]  rounded-b-full"></div>
    <div className="z-10 flex flex-col items-center justify-center h-full w-full">
      <PlusOutlined className="text-4xl text-[#2080CA] mb-2" />
      <p className="text-sm text-center font-bold text-[#333333]">Add Sport</p>
    </div>
  </div>
);

export default AddSportsCard;
