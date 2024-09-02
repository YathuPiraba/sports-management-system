import React, { useState, useEffect } from "react";
import { fetchVerifiedMemberDataApi } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { MdOutlineSkipPrevious, MdOutlineSkipNext } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { Popconfirm, message } from "antd";
import GridLoader from "react-spinners/GridLoader";
import { IoSearchCircleOutline } from "react-icons/io5";
import { mdiSortCalendarAscending, mdiSortCalendarDescending } from "@mdi/js";
import { Link } from "react-router-dom";

const ClubMembers = () => {
  const [members, setMembers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const user = useSelector((state) => state.auth.userdata);
  const userId = user.userId;

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetchVerifiedMemberDataApi(userId);
      console.log(res.data);
      setMembers(res.data.data);
      const paginationData = res.data.pagination;

      setPagination({
        currentPage: paginationData.current_page,
        totalPages: paginationData.last_page,
        perPage: paginationData.per_page,
        total: paginationData.total,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // Define the columns dynamically
    setColumns([
      { key: "no", label: "No" },
      { key: "image", label: "Image" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "age", label: "Age" },
      { key: "created_at", label: "Join Date" },
      { key: "actions", label: "Actions" },
    ]);
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[75vh]">
        <GridLoader
          loading={loading}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#4682B4"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Club Members</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member, index) => (
              <tr key={member.member_id}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.key === "no" && (
                      <div className="text-sm text-gray-500">{index + 1}</div>
                    )}
                    {column.key === "image" && (
                      <div className="flex items-center">
                        <img
                          src={member.user?.image || "/default-avatar.png"}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    )}
                
                    {column.key === "name" && (
                      <div className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                    )}
                    {column.key === "role" && (
                      <div className="text-sm text-gray-500">
                        {member.position}
                      </div>
                    )}
                    {column.key === "age" && (
                      <div className="text-sm text-gray-500">{member.age}</div>
                    )}
                    {column.key === "created_at" && (
                      <div className="text-sm text-gray-500">
                        {member.created_at}
                      </div>
                    )}
                    {column.key === "actions" && (
                      <div className="text-sm font-medium">
                        <Popconfirm>
                          <button className="text-red-600 hover:text-red-900">
                            Remove
                          </button>
                        </Popconfirm>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <div className="flex space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-2 py-2 border rounded-md ${
                pagination.currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              <MdOutlineSkipPrevious />
            </button>

            {/* Next Button */}
            <button
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-2 py-2 border rounded-md ${
                pagination.currentPage === pagination.totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              <MdOutlineSkipNext />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubMembers;
