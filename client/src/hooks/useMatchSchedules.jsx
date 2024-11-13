import { useState, useEffect } from "react";
import { matchSchedulesDataAPI } from "../Services/apiServices";
import { toast } from "react-hot-toast";

const useMatchSchedules = (selectedEvent) => {
  const [matches, setMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatchSchedule = async () => {
    setLoading(true);
    try {
      const res = await matchSchedulesDataAPI(selectedEvent);
      console.log(res.data.data);

      // Transform the data structure to match our needs
      const transformedMatches = res.data.data.matches.reduce(
        (acc, dateGroup) => {
          dateGroup.matches.forEach((match) => {
            acc.push({
              ...match,
              date: dateGroup.date,
            });
          });
          return acc;
        },
        []
      );

      setMatches(transformedMatches);
      setSports(res.data.data.uniqueSports || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching match schedules:", error);
      setError("Failed to fetch match schedules.");
      toast.error("Error fetching match schedules list");
    } finally {
      setLoading(false);
    }
  };

  console.log(sports);

  useEffect(() => {
    if (selectedEvent) {
      fetchMatchSchedule();
    }
  }, [selectedEvent]);

  return { fetchMatchSchedule, matches, sports, loading, error };
};

export default useMatchSchedules;
