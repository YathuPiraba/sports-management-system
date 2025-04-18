import React, { useState, useEffect } from "react";
import { getAMemberEventParticipantsAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";

const MemberParticipants = ({ eventId, userId, theme }) => {
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState(null);

  const fetchParticipatingSports = async () => {
    setLoading(true);
    try {
      const res = await getAMemberEventParticipantsAPI(userId, eventId);
      setMemberData(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching participation list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipatingSports();
  }, [eventId]);

  if (!memberData || memberData.length === 0) {
    return (
      <div className="text-center font-poppins text-2xl text-gray-600 min-h-[400px] flex items-center justify-center">
        Currently, you are not participating in this event.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <PropagateLoader color="#2563eb" />
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(memberData.event_sports);

  return (
    <div className="container mx-auto p-4">
      {/* Compact Member Profile Row */}
      <div
        className={`${
          theme === "light" ? "bg-gray-100" : "bg-gray-200"
        }  rounded-lg shadow-md p-4 mb-6 `}
      >
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-100 flex-shrink-0">
            <img
              src={
                memberData.member?.image ||
                "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
              }
              alt={`${memberData.member?.firstName} ${memberData.member?.lastName}`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-bold text-gray-800">
              {memberData.member?.firstName} {memberData.member?.lastName}
            </h2>
            <p className="text-gray-600 text-sm">
              {memberData.member?.position}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
              <img
                src={
                  memberData.member?.clubImage ||
                  "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                }
                alt={memberData.member?.clubName}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-medium text-sm text-gray-700">
              {memberData.member?.clubName}
            </span>
          </div>
        </div>
      </div>

      {/* Event Sports Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberData?.event_sports.length > 0 ? (
          memberData.event_sports.map((event) => (
            <div
              key={event.id}
              className={`${
                theme === "light" ? "bg-gray-100" : "bg-gray-200"
              }  rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="relative h-40">
                <img
                  src={event.sport?.image}
                  alt={event.sport?.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-sm">
                  {event.sport.name}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-1">
                  {event.name}
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                  {/* Duration */}
                  <div className="font-medium">Duration:</div>
                  <div className="text-xs text-left">
                    {formatDate(event.start_date)} -{" "}
                    {formatDate(event.end_date)}
                  </div>

                  {/* Venue */}
                  <div className="font-medium">Venue:</div>
                  <div className="capitalize text-left">{event.place}</div>

                  {/* Role */}
                  <div className="col-span-2 border-t pt-2 mt-2">
                    <div className="grid grid-cols-2">
                      <div className="font-medium">Role:</div>
                      <div className="text-blue-600 font-medium text-left">
                        {event.skill_name || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 col-span-full">
            Currently, you are not participating in any event sports.
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberParticipants;
