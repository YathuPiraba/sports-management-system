import React from "react";
import { NavLink } from "react-router-dom";
import { BiGroup } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { MdEmojiEvents, MdApproval } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const ManagerSideBar = ({ theme }) => {
  return (
    <nav
      aria-label="side navigation"
      className="flex-1 overflow-y-scroll no-scrollbar"
    >
      <div>
        <ul className="flex flex-1 flex-col gap-2 pt-0">
          {/* Club Link */}
          <div className="list">
            <li className="px-3">
              <NavLink
                to="/manager/club"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded p-3 transition-colors ${
                    isActive
                      ? theme === "light"
                        ? "text-green-600 hover:text-white"
                        : "text-green-600 hover:text-white"
                      : ""
                  }`
                }
              >
                <div className="flex items-center self-center">
                  <BiGroup size={20} />
                </div>
                <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                  Club
                </div>
              </NavLink>
            </li>
          </div>

          {/* Members Link */}
          <div className="list">
            <li className="px-3">
              <NavLink
                to="/manager/members"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded p-3 transition-colors ${
                    isActive
                      ? theme === "light"
                        ? "text-green-600 hover:text-white"
                        : "text-green-600 hover:text-white"
                      : ""
                  }`
                }
              >
                <div className="flex items-center self-center">
                  <BsPeople size={20} />
                </div>
                <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                  Members
                </div>
              </NavLink>
            </li>
          </div>

          {/* Events Link */}
          <div className="list">
            <li className="px-3">
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded p-3 transition-colors ${
                    isActive
                      ? theme === "light"
                        ? "text-green-600 hover:text-white"
                        : "text-green-600 hover:text-white"
                      : ""
                  }`
                }
              >
                <div className="flex items-center self-center">
                  <MdEmojiEvents size={22} />
                </div>
                <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                  Events
                </div>
              </NavLink>
            </li>
          </div>

          {/* Approvals Link */}
          <div className="list">
            <li className="px-3">
              <NavLink
                to="/manager/approvals"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded p-3 transition-colors ${
                    isActive
                      ? theme === "light"
                        ? "text-green-600 hover:text-white"
                        : "text-green-600 hover:text-white"
                      : ""
                  }`
                }
              >
                <div className="flex items-center self-center">
                  <MdApproval size={20} />
                </div>
                <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                  Approvals
                </div>
              </NavLink>
            </li>
          </div>

          {/* Settings Link */}
          <div className="list">
            <li className="px-3">
              <NavLink
                to="/manager/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded p-3 transition-colors ${
                    isActive
                      ? theme === "light"
                        ? "text-green-600 hover:text-white"
                        : "text-green-600 hover:text-white"
                      : ""
                  }`
                }
              >
                <div className="flex items-center self-center">
                  <IoIosSettings size={20} />
                </div>
                <div className="flex w-full flex-1 font-light tracking-wider flex-col items-start justify-center gap-0 overflow-hidden truncate text-sm">
                  Settings
                </div>
              </NavLink>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default ManagerSideBar;
