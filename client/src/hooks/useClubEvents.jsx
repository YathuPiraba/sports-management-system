import { useState, useEffect } from "react";
import { getAClubEventParticipantsAPI } from "../Services/apiServices";

const useClubEvents = (selectedEvent, userId) => {
  const [eventSportsWithParticipants, setEventSportsWithParticipants] =
    useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClubEvents = async () => {
    if (selectedEvent) {
      setLoading(true);
      try {
        const res = await getAClubEventParticipantsAPI(userId, selectedEvent);
        const eventSportsData = res.data.data.map((item) => ({
          ...item.event_sports,
          participants: item.event_sports.participants || [],
        }));
        setEventSportsWithParticipants(eventSportsData);
      } catch (error) {
        console.error("Error fetching club events:", error);
        setError("Failed to fetch club events.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchClubEvents();
  }, [selectedEvent, userId]);

  return {fetchClubEvents, eventSportsWithParticipants, loading, error };
};

export default useClubEvents;
