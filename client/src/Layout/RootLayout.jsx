import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Sidebar from "../Components/SideBar/Sidebar";
import { useTheme } from "../context/ThemeContext";

const RootLayout = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`min-h-screen grid grid-cols-12 ${
        theme === "light"
          ? "bg-customGreen text-black"
          : "bg-customDark text-white"
      }`}
    >
      <div className="lg:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-10 lg:pl-16 flex flex-col  w-full h-[100%] ">
        <Navbar />
        <div className="py-2 h-[100%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
