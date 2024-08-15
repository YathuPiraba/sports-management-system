import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchManagerDetailApi } from "../Services/apiServices";

export const useSingleManagerDetails = () => {
  const userId = useSelector((state) => state.auth.userdata.userId);
  const [managerDetails, setManagerDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManagerDetails = async () => {
    if (!userId) return;

    try {
      const response = await fetchManagerDetailApi(userId);
      setManagerDetails(response.data.manager);
      setError(null);
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching manager details"
      );
      setManagerDetails(null);
    }
  };

  useEffect(() => {
    const fetchDetailsWithLoading = async () => {
      setLoading(true);
      await fetchManagerDetails();
      setLoading(false);
    };

    fetchDetailsWithLoading();
  }, [userId]);

  return { managerDetails, loading, error, refetchManagerDetails: fetchManagerDetails };
};