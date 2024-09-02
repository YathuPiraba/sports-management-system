import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMemberDetailsApi } from "../../Services/apiServices";
import { GridLoader } from "react-spinners";

const MemberProfile = () => {
  const { memberId } = useParams();
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const res = await fetchMemberDetailsApi(memberId);
        setMemberDetails(res.data.data);

        console.log(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [memberId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[75vh]">
        <GridLoader
          loading={loading}
          size={15}
          aria-label="Loading Spinner"
          color="#4682B4"
        />
      </div>
    );
  }

  if (!memberDetails) {
    return <p>Member not found</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Member Profile</h2>
      {/* Render member details here */}
      <div>
        <img
          src={memberDetails.image || "/default-avatar.png"}
          alt={`${memberDetails.firstName} ${memberDetails.lastName}`}
          className="w-24 h-24 rounded-full"
        />
        <p>
          Name: {memberDetails.firstName} {memberDetails.lastName}
        </p>
        <p>Role: {memberDetails.position}</p>
        <p>Age: {memberDetails.age}</p>
        <p>Joined on: {memberDetails.created_at}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default MemberProfile;
