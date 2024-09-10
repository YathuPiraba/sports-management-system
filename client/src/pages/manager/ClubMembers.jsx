import React, { useState, useEffect } from "react";
import {
  fetchVerifiedMemberDataApi,
  deactivateUserAPI,
  restoreUserAPI,
} from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { Popconfirm, message } from "antd";
import GridLoader from "react-spinners/GridLoader";
import { IoSearchCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Pagination from "../../Components/Pagination_Sorting_Search/Pagination";
import SortControls from "../../Components/Pagination_Sorting_Search/SortControls";

const ClubMembers = () => {
  const [members, setMembers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState({
    sortBy: "name",
    sort: "asc",
  });

  const user = useSelector((state) => state.auth.userdata);
  const userId = user.userId;

  const fetchMembers = async (
    page = 1,
    perPage = 5,
    sortBy = sortConfig.sortBy,
    sort = sortConfig.sort
  ) => {
    setLoading(true);
    try {
      const res = await fetchVerifiedMemberDataApi(
        userId,
        page,
        perPage,
        sortBy,
        sort
      );
      setMembers(res.data.data);
      setFilteredMembers(res.data.data);
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
    fetchMembers(
      pagination.currentPage,
      pagination.perPage,
      sortConfig.sortBy,
      sortConfig.sort
    );

    setColumns([
      { key: "no", label: "No" },
      { key: "profile", label: "Profile" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "age", label: "Age" },
      { key: "created_at", label: "Join Date" },
      { key: "actions", label: "Actions" },
    ]);
  }, [sortConfig]);

  const handleSortChange = (sortBy, sort) => {
    setSortConfig({ sortBy, sort });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(
        members.filter((member) =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(query)
        )
      );
    }
  };

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
      fetchMembers(
        pagination.currentPage,
        pagination.perPage,
        sortConfig.sortBy,
        sortConfig.sort
      );
    } catch (error) {
      console.error("Error in action:", error);
      message.error("Action failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex gap-5 mb-4 lg:mb-0">
          <h2 className="text-2xl font-bold">Club Members</h2>
          <SortControls onSortChange={handleSortChange} />
        </div>
        <div className="relative lg:ml-auto">
          <input
            type="search"
            placeholder="Search Members..."
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded-md p-1 text-sm pl-8 w-full lg:w-64"
          />
          <IoSearchCircleOutline
            size={22}
            className="absolute top-0 left-2 mt-1 text-blue-500"
          />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <tr key={member.member_id}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-2 whitespace-nowrap text-sm"
                    >
                      {column.key === "no" && (
                        <div className="text-gray-500">{index + 1}</div>
                      )}
                      {column.key === "profile" && (
                        <div className="flex items-center">
                          <img
                            src={member.user?.image || "/default-avatar.png"}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                      )}

                      {column.key === "name" && (
                        <div className="text-blue-600 hover:text-blue-800">
                          <Link to={`/club/member/${member.member_id}`}>
                            {member.firstName} {member.lastName}
                          </Link>
                        </div>
                      )}
                      {column.key === "role" && (
                        <div className="text-gray-500">{member.position}</div>
                      )}
                      {column.key === "age" && (
                        <div className="text-gray-500">{member.age}</div>
                      )}
                      {column.key === "created_at" && (
                        <div className="text-gray-500">{member.created_at}</div>
                      )}
                      {column.key === "actions" && (
                        <div className="text-sm font-medium">
                          <Popconfirm
                            title={
                              member.user.deleted_at
                                ? "Are you sure you want to activate this user?"
                                : "Are you sure you want to deactivate this user?"
                            }
                            onConfirm={() =>
                              handleAction(
                                member.user.id,
                                !!member.user.deleted_at
                              )
                            }
                            okText="Yes"
                            cancelText="No"
                          >
                            <button
                              className={
                                member.user.deleted_at
                                  ? "text-blue-600 hover:text-blue-900"
                                  : "text-red-600 hover:text-red-900"
                              }
                            >
                              {member.user.deleted_at
                                ? "Activate"
                                : "Deactivate"}
                            </button>
                          </Popconfirm>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-2 text-center">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        goToPage={goToPage}
      />
    </div>
  );
};

export default ClubMembers;
