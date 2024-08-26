import React from "react";
import { useTheme } from "../../context/ThemeContext";

const MemberApprovalTable = ({
  memberData,
  memberColumns,
  playerColumns,
  coachColumns,
}) => {
  const { theme } = useTheme();

  const memberColumnMapping = {
    Profile: "image",
    "Full Name": "fullName",
    Age: "age",
    Email: "email",
    Address: "address",
    NIC: "nic",
    "Contact No": "contactNo",
    "G.N Division": "divisionName",
  };

  const renderCell = (data, column, mapping) => {
    const keys = mapping[column].split(".");
    const value = keys.reduce((acc, key) => acc[key], data);

    if (column === "Full Name") {
      return `${data.firstName} ${data.lastName}`;
    }

    if (column === "Profile") {
      return value ? (
        <img
          src={value}
          alt={`${column} for ${data.firstName} ${data.lastName}`}
          className="w-16 h-16 object-cover rounded-full"
        />
      ) : (
        "N/A"
      );
    }

    if (column === "Age") {
      return value === 0 ? value : value;
    }

    if (column === "Address") {
      return value
        ? value
            .split(",")
            .map((line, index) => <div key={index}>{line.trim()}</div>)
        : "N/A";
    }
    return value || "N/A";
  };

  return (
    <div
      className={`space-y-8 border-gray-300 font-roboto shadow-md text-black ${
        theme === "light" ? "bg-blue-500" : "bg-blue-400"
      } px-3 py-3`}
    >
      {memberData.map((member) => (
        <div
          key={member.memberId}
          className={`relative px-6 border border-gray-300 rounded-md shadow-md ${
            theme === "light" ? "bg-white" : "bg-gray-300"
          }`}
        >
          <table className="w-full divide-y divide-gray-200 mb-4">
            <thead>
              <tr>
                {memberColumns.map((col) => (
                  <th
                    key={col}
                    className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {memberColumns.map((col) => (
                  <td key={col} className="px-2 py-4 whitespace-nowrap text-sm">
                    {renderCell(member, col, memberColumnMapping)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <h3 className="text-md font-semibold mb-2">
            {" "}
            {member.position === "Coach"
              ? "Coach & Experience"
              : "Player & Skills:"}
          </h3>
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {member.position === "Coach"
                  ? coachColumns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))
                  : playerColumns.map((col) => (
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
              {member.sports.map((sport, index) => (
                <tr key={index}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {sport.sport_name}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    {member.position === "Coach"
                      ? member.experience || "N/A"
                      : sport.skills.length > 0
                      ? sport.skills.map((skill) => skill.skill_name).join(", ")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MemberApprovalTable;
