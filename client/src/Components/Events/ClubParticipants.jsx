import React, { useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ClubParticipants = ({ participants, loading, theme }) => {
  const [expandedCardId, setExpandedCardId] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  const clubInfo = participants[0]?.club || {};

  if (!clubInfo || Object.keys(clubInfo).length === 0) {
    return (
      <div className="text-center font-poppins text-2xl text-gray-600 min-h-[400px] flex items-center justify-center">
        Your club is not yet participating in this event.
      </div>
    );
  }

  const toggleCard = (eventId) => {
    setExpandedCardId(expandedCardId === eventId ? null : eventId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Club Header */}
      <div
        className={`${
          theme === "light" ? "bg-gray-100" : "bg-gray-200"
        } rounded-lg shadow-md p-4 mb-6`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img
              src={
                clubInfo.image ||
                "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
              }
              alt={clubInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{clubInfo.name}</h2>
        </div>
      </div>

      {/* Sports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants?.map((event) => {
          const isExpanded = expandedCardId === event.id;
          return (
            <div
              key={event.id}
              className={`${
                theme === "light" ? "bg-gray-100" : "bg-gray-200"
              } rounded-lg shadow-md overflow-hidden`}
              style={{ height: isExpanded ? "auto" : "280px" }}
            >
              {/* Sports Card Header */}
              <div className="relative h-32">
                {event.sports.image ? (
                  <img
                    src={event.sports.image}
                    alt={event.sports.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">
                  {event.sports.name}
                </div>
              </div>

              {/* Event Info */}
              <div className="p-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {event.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Venue:</span>
                    <span>{event.place}</span>
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleCard(event.id)}
                  className="w-full mt-2 pt-2 border-t flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span className="mr-1">
                    {event?.participants?.length} Participants
                  </span>
                  {isExpanded ? (
                    <FaChevronUp size={20} />
                  ) : (
                    <FaChevronDown size={20} />
                  )}
                </button>

                {/* Expandable Participants Section */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t space-y-2">
                    {event?.participants?.map((participant) => (
                      <div
                        key={participant.member.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                          <img
                            src={
                              participant.member.image ||
                              "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                            }
                            alt={participant.member.firstName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {participant.member.firstName}{" "}
                            {participant.member.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {participant.member.position}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClubParticipants;
