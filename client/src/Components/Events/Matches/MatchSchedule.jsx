import React, { useState, useEffect } from "react";
import { IoSearchCircleOutline } from "react-icons/io5";
import AddScheduleModal from "./AddScheduleModal";
import {
  getMatchSchedulesAPI,
  getEventClubsAPI,
} from "../../../Services/apiServices";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import Pagination from "../../Pagination_Sorting_Search/Pagination";

const MatchSchedule = ({ roleId, eventId }) => {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 1,
    total: 0,
  });

  const fetchMatchSchedule = async (page = 1, search = searchDate) => {
    setLoading(true);
    try {
      const res = await getMatchSchedulesAPI(
        eventId,
        page,
        pagination.perPage,
        search
      );
      setMatches(res.data.data.matches);
      setPagination({
        currentPage: res.data.data.pagination.current_page,
        lastPage: res.data.data.pagination.last_page,
        perPage: res.data.data.pagination.per_page,
        total: res.data.data.pagination.total,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching match schedules list");
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipatingClubs = async () => {
    try {
      const res = await getEventClubsAPI(eventId);
      setEventData(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching participation list");
    }
  };

  const handlePageChange = (page) => {
    fetchMatchSchedule(page, pagination.perPage);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSearchDate(newDate);
    fetchMatchSchedule(1, newDate); // Trigger search immediately when date changes
  };

  useEffect(() => {
    fetchParticipatingClubs();
    fetchMatchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  const startingIndex = (pagination.currentPage - 1) * pagination.perPage + 1;
  let matchNumber = startingIndex;
  let dateNumber = startingIndex;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Search and Add Schedule button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Match Schedule</h1>

        {roleId === 1 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap"
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
            <span>Add Schedule</span>
          </button>
        )}
      </div>
      <div className="m-2 mt-0">
        <div className="flex items-center gap-2">
          <h5 className="font-poppins">Search by:</h5>
          <div className=" relative">
            <IoSearchCircleOutline
              size={20}
              className="text-blue-600 absolute left-2 top-3"
            />
            <input
              type="date"
              value={searchDate}
              onChange={handleDateChange}
              className="w-full md:w-40 pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Match Cards or No Schedules message */}
      {matches.length === 0 ? (
        <div className="text-center text-xl font-semibold text-gray-600">
          No schedules available for this event.
        </div>
      ) : (
        <div className="space-y-8">
          {matches.map((dateGroup, index) => (
            <div key={index}>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  {`${dateNumber++} . ${dateGroup.date}`}
                </h2>
              </div>

              {dateGroup.matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden mb-4"
                >
                  <div className="border-b border-gray-200 p-4 flex items-center justify-between space-x-4">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-gray-700">
                        {`${matchNumber++} .`}
                      </span>
                      <img
                        src={
                          match.sportImage ||
                          "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                        }
                        alt={match.sport}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-lg font-medium text-gray-700">
                        {match.sport}
                      </span>
                    </div>
                    <div className="mt-1 font-mono">
                      {match.event_start_date} - {match.event_end_date}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center space-y-2">
                        <img
                          src={
                            match.club1.image ||
                            "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                          }
                          alt={match.club1.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {match.club1.name}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-gray-700">
                          VS
                        </span>
                        <span className="text-sm text-gray-500 mt-2">
                          {match.time}
                        </span>
                        <span className="text-sm text-gray-500">
                          {match.place}
                        </span>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <img
                          src={
                            match.club2.image ||
                            "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                          }
                          alt={match.club2.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {match.club2.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {matches.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.lastPage}
            goToPage={handlePageChange}
          />
        </div>
      )}

      {roleId === 1 && eventData && (
        <AddScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          eventData={eventData}
          fetchMatchSchedule={fetchMatchSchedule}
        />
      )}
    </div>
  );
};

export default MatchSchedule;
