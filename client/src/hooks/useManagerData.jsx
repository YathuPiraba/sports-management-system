import { useState, useEffect } from "react";
import echo from "../utils/echo";
import { fetchManagerPendingDataApi } from "../Services/apiServices";

const useManagerData = () => {
  const [managerData, setManagerData] = useState([]);
  const [clubData, setClubData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchManagerData = async (page, perPage) => {
    setLoading(true);
    try {
      const res = await fetchManagerPendingDataApi(page, perPage);

      const managers = res.data.data;
      const paginationData = res.data.pagination;


      // // Separate verified and unverified managers
      // const unverifiedManagers = managers.filter(
      //   (manager) => manager.user.is_verified == 0
      // );

      // console.log("hi",unverifiedManagers);

      const filteredManagers = managers.map((manager) => ({
        managerId: manager.managerId,
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.user.email,
        image: manager.user.image,
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
          clubImage: club.clubImage,
          gsDivisionName: club.clubDivisionName,
          address: club.clubAddress,
          contactNo: club.clubContactNo,
          managers: filteredManagers.filter(
            (manager) => manager.club.clubName === clubName
          ),
        };
      });

      setClubData(unverifiedClubs);

      setPagination({
        currentPage: paginationData.current_page,
        totalPages: paginationData.last_page,
        perPage: paginationData.per_page,
        total: paginationData.total,
      });

    } catch (error) {
      console.error("Error fetching Apply data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Attempting to subscribe to channel...");
    fetchManagerData(pagination.currentPage, pagination.perPage);

    const channel = echo.channel("managers");

    // Listen for real-time updates
    channel.listen(".ManagerApplied", (event) => {
      console.log("New manager applied:", event.manager);
      // Fetch the updated manager data
      fetchManagerData(pagination.currentPage, pagination.perPage);
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

  const goToPage = (page) => {
    fetchManagerData(page, pagination.perPage);
  };


  return { managerData, clubData, pagination, loading, goToPage, fetchManagerData };
};

export default useManagerData;
