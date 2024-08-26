import { useState, useEffect } from "react";
import echo from "../utils/echo";
import { fetchMemberDataApi } from "../Services/apiServices";
import { useSelector } from "react-redux";

const useMemberNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = useSelector((state) => state.auth.userdata.userId);

  const fetchMemberData = async () => {
    try {
      const res = await fetchMemberDataApi(userId);
      const members = res.data.data;

      // Separate verified and unverified members
      const unverifiedMembers = members.filter(
        (member) => member.user.is_verified === 0
      );

      // Map filtered members to notifications
      const newNotifications = unverifiedMembers.map((member) => ({
        type: "manager",
        message: `${member.firstName} ${member.lastName} applied for joining request as ${member.position}`,
        image: `${member.user.image}`,
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
        await fetchMemberData();

        // Listen for real-time updates on the "managers" channel
        echo.channel("members").listen(".MemberApplied", (event) => {
          console.log("Notification updated:", event.manager);
          fetchMemberData();
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
      echo.leaveChannel("members");
    };
  }, []);

  return { notifications };
};

export default useMemberNotifications;
