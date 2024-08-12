import React, { useState } from "react";
import logo from "../../assets/logo2.png";
import "./Sidebar.css";
import { useTheme } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import AdminSideBar from "./admin_manager_member/AdminSideBar";
import ManagerSideBar from "./admin_manager_member/ManagerSideBar";
import MemberSideBar from "./admin_manager_member/MemberSideBar";

export default function Sidebar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { theme } = useTheme();
  const role_id = useSelector((state) => state.auth.userdata.role_id);


  return (
    <>
      <button
        title="Side navigation"
        type="button"
        className={`visible fixed flex justify-end right-2 ${
          theme === "light" ? "bg-white" : "bg-gray-200"
        } custom-navi  z-40 order-10 h-10 w-10 self-center rounded opacity-100 lg:hidden ${
          isSideNavOpen
            ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
            : ""
        }`}
        aria-haspopup="menu"
        aria-label="Side navigation"
        aria-expanded={isSideNavOpen ? " true" : "false"}
        aria-controls="nav-menu-4"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <div
          className={`absolute top-1/2 left-1/2 w-6 text-black -translate-x-1/2 -translate-y-1/2 transform`}
        >
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-700 transition-all duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
          ></span>
        </div>
      </button>

      <aside
        id="nav-menu-4"
        aria-label="Side navigation"
        className={`fixed z-50 font-poppins  ${
          theme === "light" ? "bg-white text-black" : "bg-gray-200 text-white"
        } top-0 bottom-0 left-0 flex w-72 flex-col border-r border-t-0 border-y-0 border-r-slate-200 transition-transform lg:translate-x-0 ${
          isSideNavOpen ? "translate-x-0" : " -translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center gap-4 p-0">
          <span className=" custom-title flex flex-row items-center justify-start  w-full place-content-center rounded-lg font-acme font-medium tracking-wide">
            <img src={logo} className="logo-img" />
            <span className="logo-name font-poppins">
              <span className="title">Club </span>
              <span className="title1">Connect</span>
            </span>
          </span>
        </div>
        {role_id === 1 && <AdminSideBar />}
        {role_id === 2 && <ManagerSideBar />}
        {role_id === 3 && <MemberSideBar />}
      </aside>
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors sm:hidden ${
          isSideNavOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
    </>
  );
}
