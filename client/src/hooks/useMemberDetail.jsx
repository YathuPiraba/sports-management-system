import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { fetchMemberDetailsByUserIdApi } from "../Services/apiServices";

export const useMemberDetail = () => {
  const auth = useSelector((state) => state.auth);
  const user = auth?.userdata;
  const userId = user?.userId;
  const [memberDetails, setMemberDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMemberDetails = async () => {
    if (!userId) return;

    try {
      const response = await fetchMemberDetailsByUserIdApi(userId);
      setMemberDetails(response.data.data);
    } catch (err) {
      setMemberDetails(null);
    }
  };

  useEffect(() => {
    const fetchDetailsWithLoading = async () => {
      setLoading(true);
      await fetchMemberDetails();
      setLoading(false);
    };

    fetchDetailsWithLoading();
  }, [userId]);

  return {
    memberDetails,
    loading,
    refetchMemberDetails: fetchMemberDetails,
  };
};
