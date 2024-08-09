import React from "react";
import { useTheme } from "../../context/ThemeContext";

const AdminApprovalTable = ({ clubData, clubColumns, managerData, managerColumns }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`space-y-8 border-gray-300 font-roboto shadow-md text-black ${
        theme === "light" ? "bg-blue-500" : "bg-blue-400"
      } px-3 py-3`}
    >
      {clubData.map(club => (
        <div
          key={club.clubName}
          className={`relative px-6 border border-gray-300 rounded-md shadow-md ${
            theme === "light" ? "bg-white" : "bg-gray-300"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 mt-2">Club Details: {club.clubName}</h2>
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
                {clubColumns.map(col => (
                  <td key={col} className="px-3 py-4 whitespace-nowrap text-sm">
                    {club[col.toLowerCase().replace(/\s+/g, '')] || 'N/A'}
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
        <h2 className="text-lg font-semibold mb-4">Manager Details</h2>
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
                {managerColumns.map(col => (
                  <td key={col} className="px-3 py-4 whitespace-nowrap text-sm">
                    {row[col.toLowerCase().replace(/\s+/g, '')] || 'N/A'}
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
