import { useState, useEffect } from "react";
import axios from "axios";

const useManagerData = () => {
  const [managerData, setManagerData] = useState([]);
  const [clubData, setClubData] = useState([]);

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
    fetchManagerData();
  }, []);

  return { managerData, clubData, fetchManagerData };
};

export default useManagerData;
