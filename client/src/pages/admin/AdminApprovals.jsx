import React, { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import AdminApprovalTable from "../../Components/Approvals/AdminApprovalTable";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";

const clubColumns = [
  "Club Name",
  "GS Division Name",
  "Address",
  "Club History",
  "Contact No",
];

const managerColumns = [
  "First Name",
  "Last Name",
  "Email",
  "Image",
  "D.O.B",
  "Address",
  "NIC",
  "Contact No",
];

const AdminApprovals = () => {
  const [expandedClub, setExpandedClub] = useState(null);
  const { theme } = useTheme();
  const [clubData, setClubData] = useState([]);
  const [managerData, setManagerData] = useState([]);

  const handleToggle = (clubName) => {
    setExpandedClub(expandedClub === clubName ? null : clubName);
  };

  const fetchManagerData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/manager/list");
      const managers = res.data.data;

      // Separate verified and unverified managers
      const unverifiedManagers = managers.filter(
        (manager) => manager.user.is_verified === 0
      );

      const filteredManagers = unverifiedManagers.map((manager) => ({
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.user.email,
        image: manager.image,
        dateOfBirth: manager.date_of_birth,
        address: manager.address,
        nic: manager.nic,
        contactNo: manager.contactNo,
        club: manager.club,
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
          gsDivisionName: club.gs_id,
          address: club.clubAddress,
          clubHistory: club.club_history,
          contactNo: club.club_contactNo,
          managers: filteredManagers.filter(
            (manager) => manager.club.clubName === clubName
          ),
        };
      });

      setClubData(unverifiedClubs);

      console.log("hi", unverifiedManagers);
    } catch (error) {
      console.error("Error fetching Gs divisions data:", error);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 font-roboto">Approval Requests</h1>
      <div className="space-y-4">
      {clubData.map((club) => (
          <div key={club.clubName}>
            <button
              className={`w-full text-left text-xl border-0 text-black hover:text-white font-semibold p-4 mb-0 rounded-sm mt-0 ${
                expandedClub === club.clubName ? 'bg-blue-400' : 'bg-gray-200'
              }`}
              onClick={() => handleToggle(club.clubName)}
            >
              {club.clubName}
            </button>
            {expandedClub === club.clubName && (
              <AdminApprovalTable
                clubData={[club]}
                clubColumns={clubColumns}
                managerData={club.managers}
                managerColumns={managerColumns}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApprovals;
