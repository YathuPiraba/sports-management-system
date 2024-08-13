import { useState, useEffect } from "react";
import echo from "../utils/echo";
import { fetchManagerDataApi } from "../Services/apiServices";

const useManagerData = () => {
  const [managerData, setManagerData] = useState([]);
  const [clubData, setClubData] = useState([]);

  const fetchManagerData = async () => {
    try {
      const res = await fetchManagerDataApi();

      const managers = res.data.data;

      // Separate verified and unverified managers
      const unverifiedManagers = managers.filter(
        (manager) => manager.user.is_verified === 0
      );

      console.log(unverifiedManagers);

      const filteredManagers = unverifiedManagers.map((manager) => ({
        managerId: manager.managerId,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.user.email,
        image: manager.image,
        dateOfBirth: manager.date_of_birth,
        address: manager.address,
        nic: manager.nic,
        contactNo: manager.contactNo,
        club: manager.club,
        userId: manager.user.user_id,
        clubId: manager.club.club_id,
      }));

      setManagerData(filteredManagers);

      const unverifiedClubs = [
        ...new Set(filteredManagers.map((manager) => manager.club.clubName)),
      ].map((clubName) => {
        const club = filteredManagers.find(
          (manager) => manager.club.clubName === clubName
        ).club;

        return {
          clubName: club.clubName,
          gsDivisionName: club.clubDivisionName,
          address: club.clubAddress,
          clubHistory: club.club_history,
          contactNo: club.clubContactNo,
          managers: filteredManagers.filter(
            (manager) => manager.club.clubName === clubName
          ),
        };
      });

      setClubData(unverifiedClubs);
    } catch (error) {
      console.error("Error fetching Apply data:", error);
    }
  };

  useEffect(() => {
    console.log("Attempting to subscribe to channel...");
    fetchManagerData();

    const channel = echo.channel("managers");

    // Listen for real-time updates
    channel.listen(".ManagerApplied", (event) => {
      console.log("New manager applied:", event.manager);
      // Fetch the updated manager data
      fetchManagerData();
    });

    channel.subscribed(() => {
      console.log("Subscribed to the managers channel");
    });

    channel.error((error) => {
      console.error("Subscription error:", error);
    });

    return () => {
      echo.leaveChannel("managers");
    };
  }, []);

  return { managerData, clubData, fetchManagerData };
};

export default useManagerData;
