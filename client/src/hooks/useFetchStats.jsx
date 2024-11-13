import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getMatchLeaderboardAPI } from "../Services/apiServices";

const useFetchStats = (selectedEvent) => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMatchLeaderboardAPI(selectedEvent);
      setStats(response.data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      toast.error("Failed to fetch stats.");
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      fetchStats();
    }
  }, [selectedEvent]); // Fetch stats once on mount

  return { stats, isLoading, error, refetch: fetchStats };
};

export default useFetchStats;
