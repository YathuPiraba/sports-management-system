import React, { useState, Suspense, lazy } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import useMemberData from "../../hooks/useMemberData";

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
  return (
    <Suspense fallback={<div>Loading... </div>}>
      <div>Manager Approvals</div>
    </Suspense>
  );
};

export default ManagerApprovals;
