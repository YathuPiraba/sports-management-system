import { useState, useEffect } from "react";
import { fetchGSDataApi } from "../Services/apiServices";

const useGsDivisions = () => {
  const [divisions, setDivisions] = useState([]);

  const fetchGsData = async () => {
    try {
      const res = await fetchGSDataApi();
      setDivisions(res.data.data);
    } catch (err) {
      console.error("Error fetching Gs divisions data:", err);
    }
  };

  useEffect(() => {
    fetchGsData();
  }, []);

  return { divisions };
};

export default useGsDivisions;
