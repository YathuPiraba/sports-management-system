import React from "react";
import { Link } from "react-router-dom";
import { RiTeamFill } from "react-icons/ri";
import { BiSolidReport, BiCategoryAlt } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import { MdEmojiEvents, MdApproval } from "react-icons/md";

const AdminSideBar = () => {
  return (
    <nav
      aria-label="side navigation"
      className="flex-1  overflow-y-scroll no-scrollbar"
    >
      <div>
        <ul className="flex flex-1 flex-col gap-2 pt-0">
          <div className="list">
            <li className="px-3 ">
              <Link
                to="/admin/dashboard"
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
                to="/admin/clubs"
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
                to="/events"
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
                to="/admin/approvals"
                className="flex items-center gap-3 rounded p-3 transition-colors"
              >
                <div className="flex items-center self-center ">
                  <MdApproval size={20} />
                </div>
                <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                  Approvals
                </div>
              </Link>
            </li>
          </div>
          <div className="list">
            <li className="px-3">
              <Link
                to="/admin/settings"
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
        </ul>
      </div>
    </nav>
  );
};

export default AdminSideBar;