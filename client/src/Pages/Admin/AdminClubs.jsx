import React, { useEffect, useState } from "react";
import { getAllClubsDetailsAPI } from "../../Services/apiServices";
import Pagination from "../../Components/Pagination_Sorting_Search/Pagination";
import { IoSearchCircleOutline } from "react-icons/io5";
import { GridLoader, PropagateLoader } from "react-spinners";
import { message } from "antd";

const AdminClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
    total: 0,
  });
  const [expandedRowIds, setExpandedRowIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("clubName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchClubData = async (
    page = pagination.currentPage,
    perPage = pagination.perPage,
    search = searchQuery,
    sortByParam = sortBy,
    sortOrderParam = sortOrder
  ) => {
    setLoading(true);
    try {
      const res = await getAllClubsDetailsAPI(
        page,
        perPage,
        sortByParam,
        sortOrderParam,
        search
      );
      setClubs(res.data.data);
      const paginationData = res.data.pagination;

      setPagination({
        currentPage: paginationData.current_page,
        totalPages: paginationData.last_page,
        perPage: paginationData.per_page,
        total: paginationData.total,
        from: paginationData.from,
        to: paginationData.to,
      });
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch club data. Please try again.");
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, [searchQuery, sortBy, sortOrder]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleSort = (field) => {
    // Toggle the sort order if the same field is clicked again
    const order = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(order);
  };

  const toggleRow = (id) => {
    // Toggle expanded row state
    setExpandedRowIds((prevExpandedRowIds) =>
      prevExpandedRowIds.includes(id)
        ? prevExpandedRowIds.filter((rowId) => rowId !== id)
        : [...prevExpandedRowIds, id]
    );
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

  console.log(sortBy, sortOrder);

  return (
    <div className="px-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex gap-5 mb-4 lg:mb-0 items-center">
          <h1 className="text-2xl mt-3 font-bold mb-4">Clubs</h1>
          <p>Sort By:</p>
          <button
            onClick={() => handleSort("clubName")}
            className={`ml-2 px-2 py-1 border rounded ${
              sortBy === "clubName"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            Club Name{" "}
            {sortBy === "clubName" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            onClick={() => handleSort("divisionName")}
            className={`ml-2 px-2 py-1 border rounded ${
              sortBy === "divisionName"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            Division Name{" "}
            {sortBy === "divisionName" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
        </div>
        <div className="relative lg:ml-auto">
          <input
            type="search"
            placeholder="Search Members/Clubs..."
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
            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50"
                >
                  <PropagateLoader
                    className="ml-1 mt-1"
                    size={10}
                    color="skyblue"
                  />
                </td>
              </tr>
            )}
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
                      {expandedRowIds.includes(club.id)
                        ? "Hide Details"
                        : "Show Details"}
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
                          <p>No manager available</p>
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
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          goToPage={(page) => fetchClubData(page, pagination.perPage)}
        />
      </div>
      <div className="flex flex-col justify-end mt-3 font-semibold font-sans">
        <p>
          Page {pagination.currentPage} of {pagination.totalPages}
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
