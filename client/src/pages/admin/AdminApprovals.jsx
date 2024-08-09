import React, { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import AdminApprovalTable from "../../components/Approvals/AdminApprovalTable";
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
  const [expanded, setExpanded] = useState(null);
  const { theme } = useTheme();
  const [clubData, setClubData] = useState([]);
  const [managerData, setManagerData] = useState([]);

  const handleToggle = (name) => {
    setExpanded(expanded === name ? null : name);
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
      }));

      setManagerData(filteredManagers);

      // Filter clubs based on the verification status
      const unverifiedClubs = unverifiedManagers.map((manager) => ({
        clubName: manager.club.clubName,
        gsDivisionName: manager.club.gs_id,
        address: manager.club.clubAddress,
        clubHistory: manager.club.club_history,
        contactNo: manager.club.clubContactNo,
      }));

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
      <ul className="space-y-4">
        <li>
          <div>
            <div
              className={`flex flex-row ${
                theme === "light"
                  ? "bg-white hover:bg-blue-400 "
                  : "bg-gray-200 hover:bg-blue-400 hover:text-white"
              }  rounded-sm shadow-md border-b  `}
            >
              <div className="w-3/4">
                <button
                  className={`w-full text-left text-xl border-0 text-black hover:text-white font-semibold p-4 mb-0 rounded-sm mt-0`}
                  onClick={() => handleToggle("clubs")}
                >
                  Club Name
                </button>
              </div>
              <div className="ml-auto flex flex-row gap-4 mr-7">
                <button>
                  {" "}
                  <FcApproval
                    size={24}
                    className="text-xl cursor-pointer"
                  />{" "}
                </button>
                <button>
                  {" "}
                  <TiDelete
                    size={28}
                    className="text-xl cursor-pointer text-red-500 hover:text-red-600"
                  />{" "}
                </button>
              </div>
            </div>
            {expanded === "clubs" && (
              <>
                <AdminApprovalTable
                  clubData={clubData}
                  clubColumns={clubColumns}
                  managerData={managerData}
                  managerColumns={managerColumns}
                />
              </>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AdminApprovals;
