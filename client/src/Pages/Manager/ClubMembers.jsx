import React, { useState, useEffect, useCallback } from "react";
import {
  fetchVerifiedMemberDataApi,
  deactivateUserAPI,
  restoreUserAPI,
} from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { Popconfirm, message } from "antd";
import { IoSearchCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Pagination from "../../Components/Pagination_Sorting_Search/Pagination";
import SortControls from "../../Components/Pagination_Sorting_Search/SortControls";
import { PropagateLoader, GridLoader } from "react-spinners";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ClubMembers = () => {
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
    total: 0,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [expandedRows, setExpandedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    sortBy: "name",
    sort: "asc",
  });

  const user = useSelector((state) => state.auth.userdata);
  const userId = user.userId;

  const columns = [
    { key: "no", label: "No" },
    { key: "profile", label: "Profile" },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "age", label: "Age" },
    { key: "created_at", label: "Join Date" },
    { key: "contactNo", label: "Contact Number" },
    { key: "whatsappNo", label: "Whatsapp Number" },
    { key: "actions", label: "Actions" },
  ];

  const fetchMembers = async (
    page = pagination.currentPage,
    perPage = pagination.perPage,
    sortBy = sortConfig.sortBy,
    sort = sortConfig.sort,
    search = searchQuery,
    gender = selectedGender
  ) => {
    setLoading(true);
    try {
      const res = await fetchVerifiedMemberDataApi(
        userId,
        page,
        perPage,
        sortBy,
        sort,
        search,
        gender
      );
      setFilteredMembers(
        res.data.data.map((member) => ({
          ...member,
          memberSports: member.sports.map((ms) => ({
            id: ms.sports_id,
            name: ms.sports_name,
          })),
        }))
      );
      const paginationData = res.data.pagination;
      console.log(res.data.data);

      setPagination({
        currentPage: paginationData.current_page,
        totalPages: paginationData.last_page,
        perPage: paginationData.per_page,
        total: paginationData.total,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch members. Please try again.");
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [sortConfig, searchQuery, selectedGender]);

  const handleSortChange = (sortBy, sort) => {
    setSortConfig({ sortBy, sort });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleGenderFilter = (gender) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };

  const toggleRow = (memberId) => {
    setExpandedRows((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAction = async (memberUserId, isDeactivated) => {
    try {
      if (isDeactivated) {
        await restoreUserAPI(memberUserId);
        message.success("User activated successfully");
      } else {
        await deactivateUserAPI(memberUserId);
        message.success("User deactivated successfully");
      }
      fetchMembers();
    } catch (error) {
      console.error("Error in action:", error);
      message.error("Action failed. Please try again.");
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[75vh]">
        <GridLoader
          loading={initialLoading}
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex gap-5 mb-4 lg:mb-0">
          <h2 className="text-2xl font-bold">Club Members</h2>
          <SortControls
            onSortChange={handleSortChange}
            sortConfig={sortConfig}
          />
        </div>
        <div className="flex items-center gap-4">
          {/* Gender Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleGenderFilter("Male")}
              className={`px-4 py-1 rounded-md ${
                selectedGender === "Male"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Male
            </button>
            <button
              onClick={() => handleGenderFilter("Female")}
              className={`px-4 py-1 rounded-md ${
                selectedGender === "Female"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Female
            </button>
          </div>
          <div className="relative">
            <input
              type="search"
              placeholder="Search Members..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-blue-200 outline-none rounded-md py-1 text-sm pl-8 pr-2 w-full lg:w-64 hover:border-blue-400"
            />
            <IoSearchCircleOutline
              size={22}
              className="absolute top-0 left-2 mt-1 text-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="pr-3 pl-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20  z-50">
                <PropagateLoader
                  className="ml-1 mt-1"
                  size={10}
                  color="skyblue"
                />
              </div>
            )}
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <>
                  <tr key={member.member_id}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="pr-2 pl-4 py-2 whitespace-nowrap text-sm"
                      >
                        {column.key === "no" && (
                          <div className="text-gray-500">
                            {(pagination.currentPage - 1) * pagination.perPage +
                              index +
                              1}
                          </div>
                        )}
                        {column.key === "profile" && (
                          <div className="flex items-center">
                            <img
                              src={
                                member.user?.image ||
                                "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                              }
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          </div>
                        )}
                        {column.key === "name" && (
                          <div className="text-blue-600 hover:text-blue-800">
                            {/* <Link to={`/club/member/${member.member_id}`}> */}
                            {member.firstName} {member.lastName}
                            {/* </Link> */}
                          </div>
                        )}
                        {column.key === "role" && (
                          <div className="text-gray-500">{member.position}</div>
                        )}
                        {column.key === "age" && (
                          <div className="text-gray-500">{member.age}</div>
                        )}
                        {column.key === "created_at" && (
                          <div className="text-gray-500">
                            {member.created_at}
                          </div>
                        )}
                        {column.key === "contactNo" && (
                          <div className="text-gray-500">
                            {member.contactNo}
                          </div>
                        )}
                        {column.key === "whatsappNo" && (
                          <div className="text-gray-500">
                            {member.whatsappNo}
                          </div>
                        )}
                        {column.key === "actions" && (
                          <div className="flex justify-between">
                            {/* Expand/Collapse Toggle */}
                            {/* Activate/Deactivate User */}
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
                                className={`${
                                  member.user.deleted_at
                                    ? "text-blue-600 hover:text-blue-800"
                                    : "text-red-600 hover:text-red-800"
                                } focus:outline-none`}
                              >
                                {member.user.deleted_at
                                  ? "Activate"
                                  : "Deactivate"}
                              </button>
                            </Popconfirm>

                            <button
                              onClick={() => toggleRow(member.member_id)}
                              className="text-blue-500 hover:text-blue-700 focus:outline-none"
                              title={
                                expandedRows.includes(member.member_id)
                                  ? "Collapse"
                                  : "Expand"
                              }
                            >
                              {expandedRows.includes(member.member_id) ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {expandedRows.includes(member.member_id) && (
                    <tr>
                      <td colSpan={columns.length} className="px-4  py-2">
                        <div className="text-sm text-gray-600 ml-5">
                          <strong>Sports playing:</strong>{" "}
                          {member.memberSports
                            .map((sport) => sport.name)
                            .join(", ")}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
        goToPage={(page) => fetchMembers(page, pagination.perPage)}
      />
    </div>
  );
};

export default ClubMembers;
