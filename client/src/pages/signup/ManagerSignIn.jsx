import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "../../Components/Signup/PersonalDetails";
import ClubDetails from "../../Components/Signup/ClubDetails";
import { applyManager } from "../../features/authslice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { fetchGSDataApi } from "../../Services/apiServices";

const ManagerSignIn = () => {
  const [divisions, setDivisions] = useState([]);
  const [clubDetails, setClubDetails] = useState({
    clubName: "",
    clubAddress: "",
    club_history: "",
    clubContactNo: "",
    clubImage: "",
    clubDivisionName: "",
  });
  const [managerDetails, setManagerDetails] = useState({
    userName: "",
    email: "",
    password: "",
    image: "",
    firstName: "",
    lastName: "",
    date_of_birth: "",
    divisionName: "",
    address: "",
    nic: "",
    contactNo: "",
    whatsappNo: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const applyRequest = async () => {
    const formData = {
      ...clubDetails,
      ...managerDetails,
    };

    try {
      const result = await dispatch(applyManager(formData)).unwrap();
      console.log("result", result);
      navigate("/home");
    } catch (error) {
      console.error("Error creating request", error);
    }
  };

  const fetchGsData = async () => {
    try {
      const res = await fetchGSDataApi();
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
    applyRequest();
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
        <PersonalDetails
          details={managerDetails}
          handleChange={handleManagerChange}
          divisions={divisions}
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded shadow-md hover:bg-blue-600"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default ManagerSignIn;
