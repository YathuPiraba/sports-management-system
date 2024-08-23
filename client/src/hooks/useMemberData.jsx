import { useState, useEffect } from "react";
import echo from "../utils/echo";
import { fetchMemberPendingDataApi } from "../Services/apiServices";

const useMemberData = () => {
  const [memberData, setMemberData] = useState([]);
  const [sportsData, setSportsData] = useState([]);
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
      const res = await fetchMemberPendingDataApi(page, perPage);

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
        userId: member.user.id,
      }));

      setMemberData(filteredMembers);


    //     "sports": [
    //         {
    //             "sport_id": 2,
    //             "sport_name": "Basketball",
    //             "skills": [
    //                 {
    //                     "skill_id": 6,
    //                     "skill_name": "Shooting Guard"
    //                 }
    //             ]
    //         }
    //     ]
    // },

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

  return <div>useMemberData</div>;
};

export default useMemberData;
