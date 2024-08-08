import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import AdminApprovalTable from "../../components/Approvals/AdminApprovalTable";
import { useTheme } from "../../context/ThemeContext";

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
  "Whatsapp No",
];

const clubData = [
  // Replace with actual data
  {
    clubName: "Club A",
    gsDivisionName: "Division A",
    address: "Address A",
    clubHistory: "History A",
    contactNo: "1234567890",
  },
];

const managerData = [
  // Replace with actual data
  {
    firstName: "First",
    lastName: "Last",
    email: "manager@example.com",
    image: "image_url",
    dateOfBirth: "1990-01-01",
    address: "Address",
    nic: "NIC123",
    contactNo: "1234567890",
    whatsappNo: "0987654321",
  },
];

const AdminApprovals = () => {
  const [expanded, setExpanded] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (name) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Approval Requests</h1>
      <ul className="space-y-4">
        <li>
          <div className={`${theme === "light" ? "bg-white" : "bg-gray-200 "}`}>
            <div
              className={`flex flex-row ${
                theme === "light"
                  ? "bg-white  hover:bg-gray-300"
                  : "bg-gray-200 hover:bg-white"
              }  rounded-sm shadow-md border-b border-gray-200 `}
            >
              <div className="w-1/2">
                <button
                  className={`w-full text-left  text-black p-4 mb-0 rounded-sm mt-0`}
                  onClick={() => handleToggle("clubs")}
                >
                  Club Name
                </button>
              </div>
              <div className="ml-auto flex flex-row mt-5 gap-4 mr-7">
                <FcApproval className="text-xl cursor-pointer hover:text-gray-700" />
                <TiDelete className="text-xl cursor-pointer text-black hover:text-gray-700" />
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
