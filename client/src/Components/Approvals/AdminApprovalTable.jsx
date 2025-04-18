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
    "Club Image": "clubImage",
    "G.N Division": "gsDivisionName",
    Address: "address",
    "Contact No": "contactNo",
  };

  const managerColumnMapping = {
    "First Name": "firstName",
    "Last Name": "lastName",
    Email: "email",
    Profile: "image",
    "D.O.B": "dateOfBirth",
    Address: "address",
    NIC: "nic",
    "Contact No": "contactNo",
  };

  const renderCell = (data, column, mapping) => {
    const key = mapping[column];
    if (column === "Club Image" || column === "Profile") {
      return  (
        <img
          src={
            data[key] ||
            "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
          }
          alt={`${column} for ${data.clubName || data.firstName}`}
          className="w-16 h-16 object-cover rounded-full"
        />
      );
    }

    if (column === "Address") {
      return data[key]
        ? data[key]
            .split(",")
            .map((line, index) => <div key={index}>{line.trim()}</div>)
        : "N/A";
    }

    return data[key] || "N/A";
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
                    {renderCell(club, col, clubColumnMapping)}
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
                    {renderCell(row, col, managerColumnMapping)}
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
