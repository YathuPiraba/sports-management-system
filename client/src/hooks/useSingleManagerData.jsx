import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchManagerDetailApi } from '../Services/apiServices'; 

export const useSingleManagerDetails = () => {
  const userId = useSelector((state) => state.auth.userdata.userId);
  const [managerDetails, setManagerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchManagerDetailApi(userId);
        setManagerDetails(response.data);
        console.log('====================================');
        console.log(response.data);
        console.log('====================================');
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching manager details');
        setManagerDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]);

  return { managerDetails, loading, error };
};