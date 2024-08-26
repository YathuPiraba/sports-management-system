import React, { useState, Suspense, lazy } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import useMemberData from "../../hooks/useMemberData";
import { Popconfirm, message } from "antd";
import GridLoader from "react-spinners/GridLoader";
import { MdOutlineSkipPrevious, MdOutlineSkipNext } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const playerColumns = ["Sports", "Skills"];
const coachColumns = ["Sports", "Experience"];

const memberColumns = [
  "Profile",
  "First Name",
  "Last Name",
  "Email",
  "Position",
  "D.O.B",
  "Address",
  "NIC",
  "Contact No",
];

const ManagerApprovals = () => {
  const { theme } = useTheme();
  const {
    memberData,
    sportsData,
    pagination,
    loading,
    goToPage,
    fetchMemberData,
  } = useMemberData();

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
          <div>Manager Approvals</div>
        )}
      </>
    </Suspense>
  );
};

export default ManagerApprovals;
