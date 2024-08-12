import { useState, useEffect } from "react";
import axios from "axios";
import echo from "../utils/echo";

const useManagerNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchManagerData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/manager/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const managers = res.data.data;

      // Separate verified and unverified managers
      const unverifiedManagers = managers.filter(
        (manager) => manager.user.is_verified === 0
      );

      // Map filtered managers to notifications
      const newNotifications = unverifiedManagers.map((manager) => ({
        type: "admin",
        message: `Manager ${manager.firstName} ${manager.lastName} applied for joining request from club ${manager.club.clubName}`,
      }));

      setNotifications(() => [...newNotifications]);
    } catch (error) {
      console.error("Error fetching manager data:", error);
    }
  };

  useEffect(() => {
    const subscribeToChannel = async () => {
      try {
        console.log("Attempting to subscribe to channel...");

        // Fetch initial manager data
        await fetchManagerData();

        // Listen for real-time updates on the "managers" channel
        echo.channel("managers").listen(".ManagerApplied", (event) => {
          console.log("New manager applied:", event.manager);
          fetchManagerData();
        });

        console.log("Successfully subscribed to channel.");
      } catch (error) {
        console.error("Error during subscription or data fetching:", error);
      }
    };

    subscribeToChannel();

    // Cleanup on component unmount
    return () => {
      console.log("Leaving channel...");
      echo.leaveChannel("managers");
    };
  }, []);

  return { notifications };
};

export default useManagerNotifications;
