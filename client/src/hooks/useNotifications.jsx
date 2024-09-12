import { useState, useEffect } from "react";
import echo from "../utils/echo"; // Ensure this is set up for broadcasting
import {
  fetchNotificationsAPI,
  readNotificationAPI,
} from "../Services/apiServices"; // Adjust based on your actual API service

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetchNotificationsAPI();
      const notificationsData = res.data.data;

      const newNotifications = notificationsData.map((event) => ({
        type: "event",
        message: `${event.club.clubName} applied for the ${event.event_sport.name} `,
        image: `${event.club.clubImage}`,
        notificationId:`${event.id}`,
      }));

      setNotifications(() => [...newNotifications]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const readNotification = async (notificationId) => {
    try {
      await readNotificationAPI(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const subscribeToChannel = async () => {
      try {
        console.log("Attempting to subscribe to Notifications channel...");

        // Fetch initial notifications
        await fetchNotifications();

        // Listen for real-time updates on the "notifications" channel
        const channel = echo.channel("notification");

        // Listen for real-time updates on the "managers" channel
        channel.listen(".Notifications", (event) => {
          console.log("Notification received:", event.notification);

          // Fetch the updated notifications
          fetchNotifications();
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
      echo.leave(`notifications`);
    };
  }, []);

  return { notifications, readNotification };
};

export default useNotifications;
