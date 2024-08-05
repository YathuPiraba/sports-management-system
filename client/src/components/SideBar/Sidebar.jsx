import React, { useState } from "react";
import logo from "../../assets/logo2.png";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { RiTeamFill } from "react-icons/ri";
import { BiSolidReport, BiCategoryAlt } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import { LuGanttChartSquare } from "react-icons/lu";
import { MdEmojiEvents } from "react-icons/md";

export default function Sidebar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  return (
    <>
      <button
        title="Side navigation"
        type="button"
        className={`visible fixed flex justify-end right-8 top-6 z-40 order-10 h-10 w-10 self-center rounded bg-gray-300 opacity-100 lg:hidden ${
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
        <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
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
        className={`fixed z-50 font-poppins bg-white text-white top-0 bottom-0 left-0 flex w-72 flex-col border-r border-t-0 border-y-0 border-r-slate-200 transition-transform lg:translate-x-0 ${
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
        <nav
          aria-label="side navigation"
          className="flex-1 text-white overflow-y-scroll no-scrollbar"
        >
          <div >
            <ul className="flex flex-1 flex-col gap-2 pt-0">
              <div className="list">
                <li className="px-3 ">
                  <Link
                    to="/"
                    className="flex items-center gap-3 rounded p-3 transition-colors"
                  >
                    <div className="flex items-center self-center">
                      <BiCategoryAlt size={20} />
                    </div>
                    <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                      Dashboard
                    </div>
                  </Link>
                </li>
              </div>
              <div className="list ">
                <li className="px-3">
                  <Link
                    to="/category"
                    className="flex items-center gap-3 rounded p-3 transition-colors"
                  >
                    <div className="flex items-center self-center ">
                      <RiTeamFill size={20} />
                    </div>
                    <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                      Clubs
                    </div>
                  </Link>
                </li>
              </div>
              <div className="list">
                <li className="px-3">
                  <Link
                    to="/products"
                    className="flex items-center gap-3 rounded p-3 transition-color"
                  >
                    <div className="flex items-center self-center ">
                      <MdEmojiEvents size={22} />
                    </div>
                    <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                      Events
                    </div>
                  </Link>
                </li>
              </div>
              <div className="list">
                <li className="px-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded p-3 transition-colors"
                  >
                    <div className="flex items-center self-center ">
                      <IoIosSettings size={20} />
                    </div>
                    <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                      Settings
                    </div>
                  </Link>
                </li>
              </div>
              {/*  
              <div className="list">
              <li className="px-3">
                <Link
                  to="/reports"
                  className="flex items-center gap-3 rounded p-3 transition-colors"
                >
                  <div className="flex items-center self-center ">
                    <BiSolidReport size={20} />
                  </div>
                  <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                    Reports
                  </div>
                </Link>
              </li>
                </div> */}
            </ul>
          </div>
        </nav>
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
