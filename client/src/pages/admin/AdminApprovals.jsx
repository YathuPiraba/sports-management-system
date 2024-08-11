import React, { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import AdminApprovalTable from "../../Components/Approvals/AdminApprovalTable";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import toast from "react-hot-toast";
import Echo from "laravel-echo";
import Pusher from "pusher-js";



window.Pusher = Pusher;
const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  encrypted: true,
});

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
      console.error("Error fetching  Apply data:", error);
    }
  };

  useEffect(() => {
    console.log('Attempting to subscribe to channel...');
    fetchManagerData();

     // Listen for real-time updates
  echo.channel('managers')
  .listen('.ManagerApplied', (event) => {
    console.log('New manager applied:', event.manager);
    // Fetch the updated manager data
    fetchManagerData();
  })
  .on('subscription_succeeded', () => {
    console.log('Subscribed to the managers channel');
  })
  .on('subscription_error', (error) => {
    console.error('Subscription error:', error);
  });

    return () => {
      echo.leaveChannel("managers");
    };
  }, []);

 

  const updateVerification = async (managerId) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/manager/update-verification/${managerId}`
      );
      toast.success("Request Approved Successfully!..");
      fetchManagerData();
    } catch (error) {
      console.error("Error updating verification:", error);
    }
  };

  const rejectRequest = async (clubId, userId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/manager/reject/${clubId}/${userId}`
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
