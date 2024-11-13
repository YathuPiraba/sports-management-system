import React, { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import AddResultModal from "./AddResultModal";
import Pagination from "../../Pagination_Sorting_Search/Pagination";
import { getMatchResultAPI } from "../../../Services/apiServices";

const MatchResults = ({
  roleId,
  eventId,
  matches,
  sports,
  schedulesLoading,
  fetchMatchSchedule,
}) => {
  const [selectedSport, setSelectedSport] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 2,
    total: 0,
  });

  const getSerialNumber = (index) => {
    return (pagination.currentPage - 1) * pagination.perPage + index + 1;
  };

  const fetchMatchResults = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getMatchResultAPI(
        eventId,
        page,
        pagination.perPage,
        selectedSport === "all" ? "" : selectedSport
      );
      const data = res.data.data;
      setMatchResults(data.match_results);
      setPagination({
        currentPage: data.pagination.current_page,
        lastPage: data.pagination.last_page,
        perPage: data.pagination.per_page,
        total: data.pagination.total_matches,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching match schedules list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchResults();
  }, [eventId, selectedSport]);

  const handlePageChange = (page) => {
    fetchMatchResults(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Sport Selection and Total Results */}
      <div className="mb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Match Results
            </h1>
          </div>
          {roleId === 1 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Results
            </button>
          )}
        </div>
      </div>
      <div className="w-full md:w-auto flex flex-col md:flex-row gap-4  font-poppins  items-center mb-2">
        <div className="flex gap-2 items-center">
          <h4 className="text-gray-600 ">Filter By:</h4>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">All Sports</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-gray-600">Total Results: {pagination.total}</p>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 ">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date, Time & Venue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teams
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scores
                </th>
                <th className="px-6  py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="ml-2"> Winner</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matchResults.map((match, index) => (
                <tr key={match.match_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getSerialNumber(index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {match.sport_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(match.match_date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      {match.match_time}
                    </div>
                    <div className="text-sm text-gray-500">{match.venue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex  text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {match.home_team.club_name}
                      </span>
                      <span className="text-sm font-medium text-gray-800 mt-1">
                        {match.away_team.club_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {match.home_team.score}
                      </span>
                      <span className="text-sm font-medium text-gray-800 mt-1">
                        {match.away_team.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        match.home_team.result === "winner"
                          ? "bg-green-100 text-green-800"
                          : match.away_team.result === "winner"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {match.home_team.result === "winner"
                        ? match.home_team.club_name
                        : match.away_team.result === "winner"
                        ? match.away_team.club_name
                        : "Tied"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {matchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.lastPage}
          goToPage={handlePageChange}
        />
      </div>

      {/* Add Results Modal */}
      {roleId === 1 && (
        <AddResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          matches={matches}
          loading={schedulesLoading}
          fetchMatchResults={fetchMatchResults}
        />
      )}
    </div>
  );
};

export default MatchResults;
