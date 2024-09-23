import React, { useEffect, useState } from "react";
import { getAllClubsDetailsAPI } from "../../Services/apiServices";

const AdminClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [expandedRowIds, setExpandedRowIds] = useState([]); // To handle the expanded state

  const fetchClubData = async () => {
    const res = await getAllClubsDetailsAPI();
    setClubs(res.data.data); // Set clubs data
    setPagination(res.data.pagination); // Set pagination data
  };

  useEffect(() => {
    fetchClubData();
  }, []);

  const toggleRow = (id) => {
    // Toggle expanded row state
    setExpandedRowIds((prevExpandedRowIds) =>
      prevExpandedRowIds.includes(id)
        ? prevExpandedRowIds.filter((rowId) => rowId !== id)
        : [...prevExpandedRowIds, id]
    );
  };

  return (
    <div className="px-6">
      <h1 className="text-2xl font-bold mb-4">Admin Clubs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50">Club Name</th>
              <th className="px-6 py-3 bg-gray-50">Address</th>
              <th className="px-6 py-3 bg-gray-50">Contact No.</th>
              <th className="px-6 py-3 bg-gray-50">Division</th>
              <th className="px-6 py-3 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clubs.map((club) => (
              <React.Fragment key={club.id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {club.clubName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {club.clubAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {club.clubContactNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {club.gs_division.divisionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => toggleRow(club.id)}
                    >
                      {expandedRowIds.includes(club.id) ? "Collapse" : "Expand"}
                    </button>
                  </td>
                </tr>
                {expandedRowIds.includes(club.id) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-100">
                      <div className="mb-2">
                        <strong>Managers:</strong>
                        {club.club_managers.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {club.club_managers.map((manager) => (
                              <li key={manager.id}>
                                {manager.firstName} {manager.lastName} -{" "}
                                {manager.contactNo}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No managers available</p>
                        )}
                      </div>
                      <div>
                        <strong>Members:</strong>
                        {club.members.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {club.members.map((member) => (
                              <li key={member.id}>
                                {member.firstName} {member.lastName} -{" "}
                                {member.contactNo}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No members available</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <p>
          Page {pagination.current_page} of {pagination.last_page}
        </p>
        <p>
          Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
          clubs
        </p>
      </div>
    </div>
  );
};

export default AdminClubs;
