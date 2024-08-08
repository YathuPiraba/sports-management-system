import React from "react";
import { TiDelete } from "react-icons/ti";
import { FcApproval } from "react-icons/fc";
import { useTheme } from "../../context/ThemeContext";

const AdminApprovalTable = ({
  clubData,
  clubColumns,
  managerData,
  managerColumns,
}) => {
  const { theme} = useTheme();

  return (
    <div
      className={`space-y-8 border-gray-300 font-roboto shadow-md text-black ${
        theme === "light" ? "bg-blue-500" : " bg-blue-400"
      } px-3 py-3`}
    >
      <div
        className={`relative px-6 border border-gray-300 rounded-md shadow-md ${
          theme === "light" ? "bg-white" : " bg-gray-300"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4 mt-2">Club Details</h2>
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
            {clubData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i} className="px-3 py-4 whitespace-nowrap text-sm">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manager Details Table */}
      <div
        className={`relative p-4 border ${
          theme === "light" ? "bg-white" : " bg-gray-300"
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
                {Object.values(row).map((value, i) => (
                  <td key={i} className="px-3 py-4 whitespace-nowrap text-sm">
                    {value}
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
