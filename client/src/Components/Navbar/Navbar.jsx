import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Space, Badge, Switch, Button } from "antd";
import { ImProfile } from "react-icons/im";
import { TbLogout2 } from "react-icons/tb";
import { logout, logOutAdmin } from "../../features/authslice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import LoginScreen from "../../Pages/Login/Login";
import { useTheme } from "../../context/ThemeContext";
import useManagerNotifications from "../../hooks/useManagerNotification";
import useMemberNotifications from "../../hooks/useMemberNotification";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FadeLoader } from "react-spinners";
import {
  fetchNotifications,
  readNotification,
} from "../../features/notificationsSlice";
import echo from "../../utils/echo";

const Navbar = () => {
  const [animate, setAnimate] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const auth = useSelector((state) => state.auth);
  const loading = auth?.loading;
  const user = auth?.userdata;
  const role_id = user?.role_id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const adminNotifications = useSelector(
    (state) => state.notifications.notifications
  );

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch notifications and subscribe to channel
  useEffect(() => {
    const subscribeToChannel = async () => {
      try {
        console.log("Attempting to subscribe to Notifications channel...");

        // Fetch initial notifications
        dispatch(fetchNotifications());

        // Listen for real-time updates on the "notifications" channel
        const channel = echo.channel("notifications");

        channel.listen(".Notifications", (event) => {
          console.log("Notification received:", event.notification);

          // Fetch the updated notifications
          dispatch(fetchNotifications());
        });

        console.log("Successfully subscribed to notifications channel.");
      } catch (error) {
        console.error("Error during subscription or data fetching:", error);
      }
    };

    subscribeToChannel();

    // Cleanup on component unmount
    return () => {
      console.log("Leaving notifications channel...");
      echo.leave(`notification`);
    };
  }, [dispatch]);

  let notifications = [];

  if (role_id == 1) {
    const managerNotifications = useManagerNotifications();
    notifications = [
      ...managerNotifications.notifications,
      ...adminNotifications,
    ];
  } else if (role_id === 2) {
    const memberNotifications = useMemberNotifications();
    notifications = memberNotifications.notifications;
  }

  const image = user?.image;

  const handleLogout = async () => {
    try {
      await dispatch(logOutAdmin());
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const notificationCount = notifications.length;

  useEffect(() => {
    if (notificationCount > 0) {
      setAnimate(true);
    }
  }, [notificationCount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    // Navigation based on role_id
    switch (role_id) {
      case 1:
        if (notification.type === "event") {
          navigate("/events");
          dispatch(readNotification(notification.notificationId));
        } else {
          navigate("/admin/approvals");
        }
        break;
      case 2:
        navigate("/manager/approvals");
        break;
      // case 3:
      //   navigate("/member/notifications"); // Member-specific route
      //   break;
      default:
        navigate("/");
    }
  };

  const items = notifications.map((notification, index) => {
    return {
      key: index,
      label: (
        <div
          className={`flex flex-row  font-serif`}
          style={{ padding: "8px", borderRadius: "5px" }}
          onClick={() => handleNotificationClick(notification)}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{ width: 30, height: 30, marginRight: 7, flexShrink: 0 }}
          >
            <img
              src={notification.image}
              alt="Image"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="mt-1"> {notification.message}</div>
        </div>
      ),
    };
  });

  return (
    <header>
      <div
        className={`mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8  w-full font-poppins`}
      >
        {/* {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm z-50">
            <FadeLoader className="ml-1 mt-1" color="skyblue" />
          </div>
        )} */}
        <div className="flex pt-2 items-center">
          <div className="flex gap-3">
            <MdDarkMode size={19} className="mt-1" />
            <Space direction="vertical">
              <Switch
                style={{
                  backgroundColor: theme === "light" ? "gray" : "skyblue",
                  padding: "8px",
                }}
                checked={theme === "light"}
                onChange={toggleTheme}
                defaultChecked={false}
              />
            </Space>
            <MdOutlineLightMode size={19} className="text-yellow-600 mt-1" />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="sm:flex sm:gap-4 space-x-6 flex mb-2">
              <div
                className={`${
                  theme === "light"
                    ? "bg-white text-black"
                    : "bg-gray-300 text-white"
                } icon-container`}
              >
                <Badge
                  count={notificationCount}
                  overflowCount={99}
                  className="mt-1"
                >
                  <Dropdown
                    menu={{
                      items,
                    }}
                    overlayClassName="h-60 overflow-auto"
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space className={animate ? "bell" : ""}>
                        <IoMdNotificationsOutline
                          size={22}
                          className="text-black"
                        />
                      </Space>
                    </a>
                  </Dropdown>
                </Badge>
              </div>
              {user ? (
                <div
                  className={`${
                    theme === "light"
                      ? "bg-white text-black"
                      : "bg-gray-300 text-black"
                  } icon-container`}
                >
                  <div className="relative mt-1 ">
                    <div
                      tabIndex={0}
                      role="button"
                      className="text-black"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span
                        className="relative inline-flex items-center justify-center rounded-full mt-0.5 overflow-hidden"
                        style={{ width: 40, height: 40 }}
                      >
                        <img
                          src={
                            image
                              ? image
                              : "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                          }
                          alt="user"
                          title="user name"
                          className="w-full h-full object-cover"
                        />
                      </span>
                    </div>
                    {dropdownOpen && (
                      <ul
                        className={`absolute right-0 mt-2 w-44 ${
                          theme === "light"
                            ? "bg-white text-black"
                            : "bg-gray-200 text-black"
                        }  rounded-md shadow-lg z-10`}
                      >
                        <li
                          className={`px-3 py-2 mt-2 mb-1 mx-2 ${
                            theme === "light"
                              ? "bg-gray-100 hover:bg-gray-300"
                              : "bg-white hover:bg-gray-400"
                          } rounded-md`}
                        >
                          <Link
                            to={
                              role_id === 1
                                ? "/admin/settings"
                                : role_id === 2
                                ? "/manager/settings"
                                : "/member/settings"
                            }
                            className="flex items-center gap-2 w-full"
                          >
                            <div className="flex items-center">
                              <ImProfile size={20} />
                            </div>
                            <span className="flex-1 text-md font-normal text-gray-600">
                              Profile
                            </span>
                          </Link>
                        </li>
                        <li
                          className={`px-2 py-2 mb-2 mt-1 mx-2 ${
                            theme === "light"
                              ? "bg-gray-100 hover:bg-gray-300"
                              : "bg-white hover:bg-gray-400"
                          } rounded-md`}
                        >
                          <Button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left"
                            loading={loading}
                            style={{
                              border: "none",
                              padding: 0,
                              paddingLeft: "5px",
                            }}
                          >
                            <div className="flex items-center">
                              <TbLogout2 size={20} />
                            </div>
                            <span className="flex-1 text-md font-normal text-gray-600">
                              Logout
                            </span>
                          </Button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <LoginScreen />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
