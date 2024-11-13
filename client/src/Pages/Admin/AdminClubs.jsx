import React, { useEffect, useState } from "react";
import {
  getAllClubsDetailsAPI,
  downloadClubDetailsAPI,
  updateClubDetailsApi,
  downloadAllClubDetailsAPI,
} from "../../Services/apiServices";
import Pagination from "../../Components/Pagination_Sorting_Search/Pagination";
import { IoSearchCircleOutline } from "react-icons/io5";
import { GridLoader, PropagateLoader } from "react-spinners";
import { Button, Modal, Input, message } from "antd";
import { FaChevronUp, FaChevronDown, FaFilePdf } from "react-icons/fa";
import { FaMobileRetro } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext";

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
  const [downloadLoading, setDownloadLoading] = useState({});
  const [clubDownloadLoading, setClubDownloadLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [registerNoInput, setRegisterNoInput] = useState("");
  const { theme } = useTheme();

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
    const order = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(order);
  };

  const toggleRow = (id) => {
    setExpandedRowIds((prevExpandedRowIds) =>
      prevExpandedRowIds.includes(id)
        ? prevExpandedRowIds.filter((rowId) => rowId !== id)
        : [...prevExpandedRowIds, id]
    );
  };

  const handleDownload = async (clubId, clubName) => {
    setDownloadLoading((prevState) => ({
      ...prevState,
      [clubId]: true,
    }));
    try {
      const response = await downloadClubDetailsAPI(clubId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${clubName} - club details.pdf`;
      link.click();

      message.success("Club details downloaded successfully");
    } catch (error) {
      console.error("Error downloading club details:", error);
      message.error("Failed to download club details. Please try again.");
    } finally {
      setDownloadLoading((prevState) => ({
        ...prevState,
        [clubId]: false,
      }));
    }
  };

  const handleAllocateRegisterNo = (clubId) => {
    setSelectedClubId(clubId);
    setIsModalVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("regNo", registerNoInput);
      await updateClubDetailsApi(selectedClubId, formData);
      message.success("Register Number allocated successfully");
      fetchClubData(); // Refresh data
    } catch (error) {
      message.error("Failed to allocate Register Number.");
      console.error(error);
    } finally {
      setIsModalVisible(false);
      setRegisterNoInput("");
    }
  };

  const handleCommonDownload = async () => {
    try {
      setClubDownloadLoading(true);
      const response = await downloadAllClubDetailsAPI();
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const currentYear = new Date().getFullYear();
      // Set the file name with the current year
      link.href = url;
      link.setAttribute("download", `All Clubs Details - ${currentYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success("Club details downloaded successfully");
    } catch (error) {
      console.error(error);
      message.error("Error downloading club details");
    } finally {
      setClubDownloadLoading(false);
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
    <div className="px-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between items-center">
        <div className=" flex gap-2 items-center">
          <h1 className="text-2xl mt-4 font-bold mb-4">Clubs</h1>
          <Button
            icon={<FaFilePdf />}
            className="ml-2 bg-sky-500 text-white mt-2"
            onClick={handleCommonDownload}
            loading={clubDownloadLoading}
          >
            Download Club Details
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center mb-2">
          <p>Sort By:</p>
          <button
            onClick={() => handleSort("clubName")}
            className={`px-2 py-1 border rounded text-sm ${
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
            className={`px-2 py-1 border rounded text-sm ${
              sortBy === "divisionName"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            Division Name{" "}
            {sortBy === "divisionName" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
        </div>

        <div className="relative mb-2">
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
        <table className="min-w-full divide-y divide-gray-200 font-poppins">
          <thead>
            <tr className={`text-black text-left`}>
              <th className="px-6 py-3 bg-gray-50">No</th>
              <th className="px-6 py-3 bg-gray-50">Registered Number</th>
              <th className="px-6 py-3 bg-gray-50">Club Name</th>
              <th className="px-6 py-3 bg-gray-50">Address</th>
              <th className="px-6 py-3 bg-gray-50">Contact No.</th>
              <th className="px-6 py-3 bg-gray-50">G.N Division</th>
              <th className="px-6 py-3 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-200 text-black"
            } divide-y divide-gray-200`}
          >
            {loading && (
              <tr>
                <td
                  colSpan="7"
                  className="flex items-center justify-center bg-opacity-20 z-50"
                >
                  <PropagateLoader
                    className="ml-1 mt-1"
                    size={10}
                    color="skyblue"
                  />
                </td>
              </tr>
            )}
            {clubs.map((club, index) => (
              <React.Fragment key={club.id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(pagination.currentPage - 1) * pagination.perPage +
                      index +
                      1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {club.regNo ? (
                      club.regNo
                    ) : (
                      <Button
                        size="small"
                        onClick={() => handleAllocateRegisterNo(club.id)}
                        className="text-blue-500 border-blue-400"
                      >
                        Allocate Register No
                      </Button>
                    )}
                  </td>
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
                  <td className="px-3 py-4 whitespace-nowrap flex gap-2">
                    <Button
                      className="bg-sky-500 border-blue-400 text-white text-sm flex items-center gap-1.5"
                      onClick={() => handleDownload(club.id, club.clubName)}
                      loading={downloadLoading[club.id]}
                    >
                      <FaFilePdf /> Download
                    </Button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => toggleRow(club.id)}
                    >
                      {expandedRowIds.includes(club.id) ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedRowIds.includes(club.id) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-100">
                      <div className="mb-2 flex">
                        <strong>Manager:</strong>
                        {club.club_managers.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {club.club_managers.map((manager) => (
                              <li
                                key={manager.id}
                                className="flex items-center gap-2"
                              >
                                {manager.firstName} {manager.lastName} :{" "}
                                <FaMobileRetro /> {manager.contactNo}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No manager available</p>
                        )}
                      </div>
                      <div className="flex">
                        <strong>Members:</strong>
                        {club.members.length > 0 ? (
                          <ol className="pl-5">
                            {club.members.map((member, index) => (
                              <li
                                key={member.id}
                                className="flex items-center gap-2"
                              >
                                {index + 1}. {member.firstName}{" "}
                                {member.lastName} : <FaMobileRetro />{" "}
                                {member.contactNo}
                              </li>
                            ))}
                          </ol>
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

      <Modal
        title="Allocate Register Number"
        open={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Submit"
      >
        <Input
          placeholder="Enter Register Number"
          value={registerNoInput}
          onChange={(e) => setRegisterNoInput(e.target.value)}
        />
      </Modal>

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          goToPage={(page) => fetchClubData(page, pagination.perPage)}
        />
      </div>
      <div className="flex gap-2 justify-between mt-3 font-semibold font-sans">
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
