import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/SideBar/Sidebar";
import "./RootLayout.css";
const RootLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-12 bg-gray-200">
      <div className="lg:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-10 lg:pl-16 flex flex-col custom w-full h-[100%] ">
        <Navbar />
        <div className="py-2 h-[100%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
