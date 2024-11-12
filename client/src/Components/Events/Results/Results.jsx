import React, { useEffect, useState } from "react";
import AddResultModal from "./AddResultModal";
import { getMatchResultAPI } from "../../../Services/apiServices";
import { PropagateLoader } from "react-spinners";
import Pagination from "../../Pagination_Sorting_Search/Pagination";

const MatchResults = ({ roleId, eventId }) => {
  const [sports, setSports] = useState(["All Sports"]);
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchMatchResults = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getMatchResultAPI(eventId, page, searchTerm);
      setSports(["All Sports", ...new Set(res.data.data.sports)]);
      setMatchResults(res.data.data.match_results);
      setPagination({
        currentPage: res.data.data.pagination.current_page,
        lastPage: res.data.data.pagination.last_page,
        perPage: res.data.data.pagination.per_page,
        total: res.data.data.pagination.total_matches,
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
  }, [eventId,searchTerm]);

  const handlePageChange = (page) => {
    fetchMatchResults(page, pagination.perPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  const getFilteredResults = () => {
    if (selectedSport === "All Sports") {
      return matchResults;
    }
    return matchResults.filter((match) => match.sport_name === selectedSport);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Sport Selection */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Match Results
          </h1>
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
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
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Teams
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Venue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Winner
                </th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Match Status
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredResults().map((match) => (
                <tr key={match.match_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {match.match_date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {match.home_team.club_name}
                      </span>
                      <span className="text-sm font-medium text-gray-800 mt-1">
                        {match.away_team.club_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {match.home_team.score}
                      </span>
                      <span className="text-sm font-medium text-gray-800 mt-1">
                        {match.away_team.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {match.venue}
                  </td>
                  <td className="px-6 py-4">
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
                  {/* <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        match.match_status === "draw"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {match.match_status === "draw" ? "Tied" : "Completed"}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>

          {getFilteredResults().length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No results found for {selectedSport}
              </p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.lastPage}
            goToPage={handlePageChange}
          />
        </div>
      </div>

      {roleId === 1 && (
        <AddResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventId={eventId}
        />
      )}
    </div>
  );
};

export default MatchResults;
