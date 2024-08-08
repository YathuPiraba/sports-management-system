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
  const { theme} = useTheme();

  const handleToggle = (name) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 font-roboto">Approval Requests</h1>
      <ul className="space-y-4">
        <li>
          <div>
            <div
              className={`flex flex-row ${
                theme === "light" ? "bg-white hover:bg-blue-400 " : "bg-gray-200 hover:bg-blue-400 hover:text-white"
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
