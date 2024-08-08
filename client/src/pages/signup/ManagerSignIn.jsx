import React, { useState, useEffect } from "react";
import axios from "axios";
import ManagerDetails from "../../components/Signup/ManagerDetails";
import ClubDetails from "../../components/Signup/ClubDetails";

const ManagerSignIn = () => {
  const [divisions, setDivisions] = useState([]);

  const [clubDetails, setClubDetails] = useState({
    clubName: "",
    address: "",
    clubHistory: "",
    contactNo: "",
    divisionName: "",
  });

  const [managerDetails, setManagerDetails] = useState({
    userName: "",
    email: "",
    password: "",
    image: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    address: "",
    nic: "",
    contactNo: "",
    whatsappNo: "",
  });

  const fetchGsData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/gs-divisions");
      setDivisions(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching Gs divisions data:", error);
    }
  };

  useEffect(() => {
    fetchGsData();
  }, []);

  const handleClubChange = (e) => {
    const { name, value } = e.target;
    setClubDetails({ ...clubDetails, [name]: value });
  };

  const handleManagerChange = (e) => {
    const { name, value } = e.target;
    setManagerDetails({ ...managerDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Club Details</h2>
        <ClubDetails
          details={clubDetails}
          handleChange={handleClubChange}
          divisions={divisions}
        />

        <h2 className="text-2xl font-bold mt-8 mb-6">Manager Details</h2>
        <ManagerDetails
          details={managerDetails}
          handleChange={handleManagerChange}
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded shadow-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ManagerSignIn;
