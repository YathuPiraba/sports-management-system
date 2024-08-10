import React from "react";
import { useTheme } from "../../context/ThemeContext";

const AdminApprovalTable = ({
  clubData,
  clubColumns,
  managerData,
  managerColumns,
}) => {
  const { theme } = useTheme();
  console.log("clubdata:", clubData);

  const clubColumnMapping = {
    "Club Name": "clubName",
    "GS Division Name": "gsDivisionName",
    Address: "address",
    "Club History": "clubHistory",
    "Contact No": "contactNo",
  };

  const managerColumnMapping = {
    "First Name": "firstName",
    "Last Name": "lastName",
    Email: "email",
    Image: "image",
    "D.O.B": "dateOfBirth",
    Address: "address",
    NIC: "nic",
    "Contact No": "contactNo",
  };
  return (
    <div
      className={`space-y-8 border-gray-300 font-roboto shadow-md text-black ${
        theme === "light" ? "bg-blue-500" : "bg-blue-400"
      } px-3 py-3`}
    >
      {clubData.map((club) => (
        <div
          key={club.clubName}
          className={`relative px-6 border border-gray-300 rounded-md shadow-md ${
            theme === "light" ? "bg-white" : "bg-gray-300"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 mt-2">Club Details :</h2>
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {clubColumns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {clubColumns.map((col) => (
                  <td key={col} className="px-3 py-4 whitespace-nowrap text-sm">
                    {club[clubColumnMapping[col]] || "N/A"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div
        className={`relative p-4 border ${
          theme === "light" ? "bg-white" : "bg-gray-300"
        } border-gray-300 rounded-md shadow-md`}
      >
        <h2 className="text-lg font-semibold mb-4">Manager Details :</h2>
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {managerColumns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {managerData.map((row, index) => (
              <tr key={index}>
                {managerColumns.map((col) => (
                  <td key={col} className="px-3 py-4 whitespace-nowrap text-sm">
                    {row[managerColumnMapping[col]] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApprovalTable;
