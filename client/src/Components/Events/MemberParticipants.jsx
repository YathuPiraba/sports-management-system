import React, { useState, useEffect } from "react";
import { getAMemberEventParticipantsAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";

const MemberParticipants = ({ eventId, userId }) => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <PropagateLoader color="#2563eb" />
      </div>
    );
  }

  if (!memberData) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Member Info Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                <img
                  src={memberData.member.image}
                  alt={`${memberData.member.firstName} ${memberData.member.lastName}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {memberData.member.firstName} {memberData.member.lastName}
                </h2>
                <p className="text-gray-600">{memberData.member.position}</p>
              </div>
              <div className="w-full border-t pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                    <img
                      src={memberData.member.clubImage}
                      alt={memberData.member.clubName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="font-medium text-gray-700">
                    {memberData.member.clubName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Sports Cards Section */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memberData.event_sports.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={event.sport.image}
                    alt={event.sport.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-sm">
                    {event.sport.name}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {event.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[70px]">
                        Duration:
                      </span>
                      <span>
                        {formatDate(event.start_date)} -{" "}
                        {formatDate(event.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[70px]">Venue:</span>
                      <span className="capitalize">{event.place}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberParticipants;
