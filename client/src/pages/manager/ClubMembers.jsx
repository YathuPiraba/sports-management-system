import React, { useState, useEffect } from "react";
import {
  fetchVerifiedMemberDataApi,
  deactivateUserAPI,
  restoreUserAPI,
} from "../../Services/apiServices";
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
    perPage: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const user = useSelector((state) => state.auth.userdata);
  const userId = user.userId;

  const fetchMembers = async (page = 1, perPage = 5) => {
    setLoading(true);
    try {
      const res = await fetchVerifiedMemberDataApi(userId, page, perPage);
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

  const goToPage = (page) => {
    fetchMembers(page, pagination.perPage);
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

  const handleAction = async (memberUserId, isDeactivated) => {
    try {
      if (isDeactivated) {
        await restoreUserAPI(memberUserId);
        message.success("User activated successfully");
      } else {
        await deactivateUserAPI(memberUserId);
        message.success("User deactivated successfully");
      }
      // Refresh the member list after action
      fetchMembers(pagination.currentPage, pagination.perPage);
    } catch (error) {
      console.error("Error in action:", error);
      message.error("Action failed. Please try again.");
    }
  };

  console.log('====================================');
  console.log(members);
  console.log('====================================');

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
                  <td
                    key={column.key}
                    className="px-6 py-2.5 whitespace-nowrap"
                  >
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
                        <Link to={`/club/member/${member.member_id}`}>
                          {member.firstName} {member.lastName}
                        </Link>
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
                        <Popconfirm
                          title={
                            member.deleted_at
                              ? "Are you sure you want to activate this user?"
                              : "Are you sure you want to deactivate this user?"
                          }
                          onConfirm={() =>
                            handleAction(member.user.id, !!member.user.deleted_at)
                          }
                          okText="Yes"
                          cancelText="No"
                        >
                          <button className="text-red-600 hover:text-red-900">
                            {member.user.deleted_at ? "Activate" : "Deactivate"}
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
        <div className="flex justify-center items-center mt-4">
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

            {/* Page Number Buttons */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  disabled={page === pagination.currentPage}
                  className={`px-4 py-2 border rounded-md ${
                    page === pagination.currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-300 hover:text-black"
                  }`}
                >
                  {page}
                </button>
              )
            )}

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
