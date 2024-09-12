import React, { useState, Suspense, lazy } from "react";
import { TiDelete } from "react-icons/ti";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import useManagerData from "../../hooks/useManagerData";
import {
  updateVerificationApi,
  rejectRequestApi,
} from "../../Services/apiServices";
import { Popconfirm, message } from "antd";
import GridLoader from "react-spinners/GridLoader";
import Pagination from "../../Components/Pagination_Sorting_Search/Pagination";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const AdminApprovalTable = lazy(() =>
  import("../../Components/Approvals/AdminApprovalTable")
);

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
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
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
              {clubData && clubData.length > 0
                ? clubData.map((club, index) => (
                    <div
                      key={club.clubName}
                      className={` ${
                        theme === "light"
                          ? "bg-white"
                          : "bg-gray-200 text-black"
                      }    w-full`}
                    >
                      <div className="flex flex-row w-full mr-0">
                        <div className="customApprove">
                          {" "}
                          <button
                            className={`w-full text-left text-l border-0 font-semibold  p-2 mb-0 rounded-sm mt-0`}
                            onClick={() => handleToggle(club.clubName)}
                          >
                            {index + 1}. {club.clubName}
                          </button>{" "}
                        </div>
                        <div className="ml-auto mt-0.5 mr-4  flex gap-6">
                          <Popconfirm
                            title="Verification"
                            description="Are you sure about verifying this Request?"
                            onConfirm={() =>
                              updateVerification(club.managers[0].managerId)
                            }
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <button>
                              <RiVerifiedBadgeFill
                                size={22}
                                className="text-green-500 hover:text-green-700"
                              />
                            </button>
                          </Popconfirm>
                          <Popconfirm
                            title="Deleting Request"
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
                  ))
                : "No Approval requests are here"}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              goToPage={goToPage}
            />

            <div className="flex justify-end text-center mt-2">
              Total items: &nbsp;{" "}
              <span className="font-bold"> {pagination.total}</span>
            </div>
          </div>
        )}
      </>
    </Suspense>
  );
};

export default AdminApprovals;
