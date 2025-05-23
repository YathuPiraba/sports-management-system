import React, { useState, Suspense, lazy } from "react";
import { TiDelete } from "react-icons/ti";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import useMemberData from "../../hooks/useMemberData";
import { Popconfirm, message } from "antd";
import GridLoader from "react-spinners/GridLoader";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import {
  rejectMemberRequestApi,
  updateMemberVerificationApi,
} from "../../Services/apiServices";
import Pagination from "../../Components/Pagination_Sorting_Search/Pagination";

const MemberApprovalTable = lazy(() =>
  import("../../Components/Approvals/MemberApprovalTable")
);

const memberColumns = [
  "Profile",
  "Full Name",
  "G.N Division",
  "Email",
  "Age",
  "Address",
  "Contact No",
];

const playerColumns = ["Sports", "Skills"];
const coachColumns = ["Sport", "Experience"];

const ManagerApprovals = () => {
  const [expandedMember, setExpandedMember] = useState(null);
  const { theme } = useTheme();
  const { memberData, pagination, loading, goToPage, fetchMemberData } =
    useMemberData();

  const handleToggle = (memberId) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  const updateVerification = async (memberId) => {
    try {
      await updateMemberVerificationApi(memberId);
      toast.success("Request Approved Successfully!..");
      fetchMemberData();
    } catch (error) {
      console.error("Error updating verification:", error);
    }
  };

  const rejectRequest = async (memberId) => {
    try {
      await rejectMemberRequestApi(memberId);
      toast.success("Request Deleted Successfully!..");
      fetchMemberData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Process cancelled");
  };

  return (
    <Suspense fallback={<div>Loading... </div>}>
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
              Manager Approvals
            </h1>
            <div className="space-y-4">
              {memberData && memberData.length > 0
                ? memberData.map((member, index) => (
                    <div
                      key={member.memberId}
                      className={`${
                        theme === "light"
                          ? "bg-white"
                          : "bg-gray-300 text-black"
                      } w-full`}
                    >
                      <div className="flex flex-row w-full hover:bg-blue-700 hover:text-white">
                        <div className="customApprove">
                          <button
                            className={`w-full text-left text-l border-0 hover:text-white font-semibold p-2 mb-0 rounded-sm mt-0`}
                            onClick={() => handleToggle(member.memberId)}
                          >
                            {(pagination.currentPage - 1) * pagination.perPage +
                              index +
                              1}
                            . {member.firstName} {member.lastName} -{" "}
                            {member.position}
                          </button>
                        </div>
                        <div className="ml-auto mt-0.5 mr-4 flex gap-6">
                          <Popconfirm
                            title="Verification"
                            description="Are you sure about verifying this Request?"
                            onConfirm={() =>
                              updateVerification(member.memberId)
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
                            onConfirm={() => rejectRequest(member.memberId)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <button className="text-red-400 hover:text-red-500">
                              <TiDelete size={28} />
                            </button>
                          </Popconfirm>
                        </div>
                      </div>
                      {expandedMember === member.memberId && (
                        <MemberApprovalTable
                          memberData={[member]}
                          memberColumns={memberColumns}
                          playerColumns={playerColumns}
                          coachColumns={coachColumns}
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
          </div>
        )}
      </>
    </Suspense>
  );
};

export default ManagerApprovals;
