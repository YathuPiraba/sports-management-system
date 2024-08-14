import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import { MdOutlineSkipPrevious, MdOutlineSkipNext } from "react-icons/md";
import AdminApprovalTable from "../../Components/Approvals/AdminApprovalTable";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import useManagerData from "../../hooks/useManagerData";
import {
  updateVerificationApi,
  rejectRequestApi,
} from "../../Services/apiServices";
import { Popconfirm, message } from "antd";
import GridLoader from "react-spinners/GridLoader";

const clubColumns = [
  "Club Image",
  "Club Name",
  "GS Division Name",
  "Address",
  "Contact No",
];

const managerColumns = [
  "Profile",
  "First Name",
  "Last Name",
  "Email",
  "D.O.B",
  "Address",
  "NIC",
  "Contact No",
];

const AdminApprovals = () => {
  const [expandedClub, setExpandedClub] = useState(null);
  const { theme } = useTheme();


  const {
    managerData,
    clubData,
    fetchManagerData,
    pagination,
    loading,
    goToPage,
  } = useManagerData();

  const handleToggle = (clubName) => {
    setExpandedClub(expandedClub === clubName ? null : clubName);
  };

  const updateVerification = async (managerId) => {
    try {
      await updateVerificationApi(managerId);
      toast.success("Request Approved Successfully!..");
      fetchManagerData();
    } catch (error) {
      console.error("Error updating verification:", error);
    }
  };

  const rejectRequest = async (clubId, userId) => {
    try {
      await rejectRequestApi(clubId, userId);
      toast.success("Request Deleted Successfully!..");
      fetchManagerData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[75vh]">
          <GridLoader
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#4682B4"
          />
        </div>
      ) : (
        <div className="px-6">
          <h1 className="text-xl font-bold mb-4 font-roboto">
            Approval Requests
          </h1>
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
                      onClick={() =>
                        updateVerification(club.managers[0].managerId)
                      }
                    >
                      <FcApproval size={22} />
                    </button>
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this Request?"
                      onConfirm={() =>
                        rejectRequest(
                          club.managers[0].clubId,
                          club.managers[0].userId
                        )
                      }
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="text-red-400 hover:text-red-500">
                        <TiDelete size={25} />
                      </button>
                    </Popconfirm>
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

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <div className="flex space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-2 py-2 border rounded-md ${
                    pagination.currentPage === 1
                      ? "cursor-not-allowed"
                      : "hover:bg-blue-300 hover:text-black"
                  } ${
                    theme === "light"
                      ? "bg-white text-black"
                      : "bg-gray-200 text-white"
                  }`}
                >
                  <MdOutlineSkipPrevious size={23} />
                </button>

                {/* Page Numbers */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    disabled={page === pagination.currentPage}
                    className={`px-4 py-2 border rounded-md ${
                      page === pagination.currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-300 hover:text-black"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-2 py-2 border rounded-md ${
                    pagination.currentPage === pagination.totalPages
                      ? "cursor-not-allowed"
                      : "hover:bg-blue-300 hover:text-black"
                  } ${
                    theme === "light"
                      ? "bg-white text-black"
                      : "bg-gray-200 text-white"
                  }`}
                >
                  <MdOutlineSkipNext size={23} />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end text-center mt-2">
            Total items: &nbsp;{" "}
            <span className="font-bold"> {pagination.total}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminApprovals;
