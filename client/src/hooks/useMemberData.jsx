import { useState, useEffect } from "react";
import echo from "../utils/echo";
import { fetchMemberPendingDataApi } from "../Services/apiServices";
import { useSelector } from "react-redux";

const useMemberData = () => {
  const [memberData, setMemberData] = useState([]);
  const [sportsData, setSportsData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  });

  const userId = useSelector((state) => state.auth.userdata.userId);

  const [loading, setLoading] = useState(false);

  const fetchMemberData = async (page, perPage) => {
    setLoading(true);
    try {
      const res = await fetchMemberPendingDataApi(userId, page, perPage);

      const members = res.data.data;
      const paginationData = res.data.pagination;

      const filteredMembers = members.map((member) => ({
        memberId: member.member_id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.user.email,
        image: member.user.image,
        dateOfBirth: member.date_of_birth,
        address: member.address,
        nic: member.nic,
        contactNo: member.contactNo,
        experience: member.experience,
        position: member.position,
        sports: member.sports,
      }));

      setMemberData(filteredMembers);

      const extractedSportsData = members
        .map((member) =>
          member.sports.map((sport) => ({
            sportId: sport.sport_id,
            sportName: sport.sport_name,
            skills: sport.skills.map((skill) => ({
              skillId: skill.skill_id,
              skillName: skill.skill_name,
            })),
          }))
        )
        .flat();

      setSportsData(extractedSportsData);

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
    fetchMemberData(pagination.currentPage, pagination.perPage);

    const channel = echo.channel("members");

    // Listen for real-time updates
    channel.listen(".MemberApplied", (event) => {
      console.log("New member applied");

      if (event.managerUserId == userId) {
        // Fetch the updated member data
        fetchMemberData(pagination.currentPage, pagination.perPage);
      }
    });

    channel.subscribed(() => {
      console.log("Subscribed to the members channel");
    });

    channel.error((error) => {
      console.error("Subscription error:", error);
    });

    return () => {
      echo.leaveChannel("members");
    };
  }, []);

  const goToPage = (page) => {
    fetchMemberData(page, pagination.perPage);
  };

  return {
    memberData,
    sportsData,
    pagination,
    loading,
    goToPage,
    fetchMemberData,
  };
};

export default useMemberData;
