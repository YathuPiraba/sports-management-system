import React, { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import AdminApprovalTable from "../../Components/Approvals/AdminApprovalTable";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import toast from "react-hot-toast";
import useManagerData from "../../hooks/useManagerData";


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

  const { managerData, clubData, fetchManagerData } = useManagerData();

  const handleToggle = (clubName) => {
    setExpandedClub(expandedClub === clubName ? null : clubName);
  };



  const updateVerification = async (managerId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("token", token);

      await axios.put(
        `http://127.0.0.1:8000/api/manager/update-verification/${managerId}`,
        {},  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Request Approved Successfully!..");
      fetchManagerData();
    } catch (error) {
      console.error("Error updating verification:", error);
    }
  };

  const rejectRequest = async (clubId, userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://127.0.0.1:8000/api/manager/reject/${clubId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Request Deleted Successfully!..");
      fetchManagerData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 font-roboto">Approval Requests</h1>
      <div className="space-y-4">
        {clubData.map((club, index) => (
          <div
            key={club.clubName}
            className={` ${
              theme === "light" ? "bg-white" : "bg-blue-500"
            }    w-full`}
          >
            <div className="flex flex-row w-full mr-0 hover:bg-blue-700 hover:text-white">
              <div className="customApprove">
                {" "}
                <button
                  className={`w-full text-left text-l border-0  hover:text-white  font-semibold p-2 mb-0 rounded-sm mt-0`}
                  onClick={() => handleToggle(club.clubName)}
                >
                  {index + 1}. {club.clubName}
                </button>{" "}
              </div>
              <div className="ml-auto mt-0.5 mr-4 flex gap-6">
                <button
                  onClick={() => updateVerification(club.managers[0].managerId)}
                >
                  <FcApproval size={22} />
                </button>
                <button
                  className="text-red-400 hover:text-red-500"
                  onClick={() =>
                    rejectRequest(
                      club.managers[0].clubId,
                      club.managers[0].userId
                    )
                  }
                >
                  <TiDelete size={25} />
                </button>
              </div>
            </div>
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
