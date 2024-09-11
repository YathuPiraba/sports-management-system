import { useState, useEffect } from "react";
import echo from "../utils/echo";
import { fetchManagerDataApi } from "../Services/apiServices";

const useManagerNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchManagerData = async () => {
    try {
      const res = await fetchManagerDataApi();
      const managers = res.data.data;

      // Separate verified and unverified managers
      const unverifiedManagers = managers.filter(
        (manager) => manager.user.is_verified === 0
      );

      // Map filtered managers to notifications
      const newNotifications = unverifiedManagers.map((manager) => ({
        type: "admin",
        message: `Manager ${manager.firstName} ${manager.lastName} applied for joining request from club ${manager.club.clubName}`,
        image: `${manager.club.clubImage}`,
      }));

      setNotifications(() => [...newNotifications]);
    } catch (error) {
      console.error("Error fetching manager data:", error);
    }
  };

  useEffect(() => {
    const subscribeToChannel = async () => {
      try {
        console.log("Attempting to subscribe to notification channel...");

        // Fetch initial manager data
        await fetchManagerData();

        const channel = echo.channel("managers");
        // Listen for real-time updates on the "managers" channel
        channel.listen(".ManagerApplied", (event) => {
          console.log("New manager applied:", event.manager);
          // Fetch the updated manager data
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
