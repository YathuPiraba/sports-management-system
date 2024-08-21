import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllClubsAPI,
  fetchGSDataApi,
  applyMemberApi,
} from "../../Services/apiServices";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import PersonalDetails from "../../Components/Signup/PersonalDetails";
import SportsDetails from "../../Components/Signup/SportsDetails";
import SignInHeader from "../../Components/Signup/SignInHeader";

const MemberSignIn = () => {
  const [divisions, setDivisions] = useState([]);
  const [memberDetails, setMemberDetails] = useState({
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

  const [clubs, setClubs] = useState([]);
  const [clubName, setClubName] = useState("");
  const [position, setPosition] = useState("");
  const [currentStep, setCurrentStep] = useState("personalDetails");

  const fetchGsData = async () => {
    try {
      const res = await fetchGSDataApi();
      setDivisions(res.data.data);
    } catch (error) {
      console.error("Error fetching Gs divisions data:", error);
    }
  };

  // Fetch all club names
  const fetchAllClubs = async () => {
    try {
      const res = await getAllClubsAPI();
      setClubs(res.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  useEffect(() => {
    fetchGsData();
    fetchAllClubs();
  }, []);

  const handleMemberChange = (e) => {
    const { name, value } = e.target;
    setMemberDetails({ ...memberDetails, [name]: value });
  };

  const handleClubNameChange = (e) => {
    setClubName(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const handleNextStep = () => {
    setCurrentStep("sportsDetails");
  };

  const handlePreviousStep = () => {
    setCurrentStep("personalDetails");
  };

  return (
    <div className="bg-customGreen max-h-screen text-black">
      <h1 className="p-4 font-poppins text-xl font-bold underline text-gray-900">
        {" "}
        Member SignIn Form
      </h1>
      <SignInHeader currentStep={currentStep} />
      {currentStep === "personalDetails" && (
        <div className="flex justify-center">
          <div className="m-6 max-h-screen w-3/4 p-9 z-20 bg-white text-black shadow-md border">
            <PersonalDetails
              details={memberDetails}
              handleChange={handleMemberChange}
              divisions={divisions}
              onNextStep={handleNextStep}
            />
          </div>
        </div>
      )}
      {currentStep === "sportsDetails" && (
        <div className="flex justify-center">
          <div className="m-6 max-h-screen w-3/4 p-9 z-20 bg-white text-black shadow-md border">
            <div className="flex justify-start mt-3">
              <button
                onClick={handlePreviousStep}
                className="bg-blue-500 text-white px-2 py-1  border rounded-md "
              >
                Previous
              </button>
            </div>
            <div className="mt-2 ">
              <label>Club Name:</label>
              <select
                name="clubName"
                value={clubName}
                onChange={handleClubNameChange}
              >
                <option value="">Select a Club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.clubName}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              <label>Position:</label>
              <select
                name="position"
                value={position}
                onChange={handlePositionChange}
              >
                <option value="">Select Position</option>
                <option value="Coach">Coach</option>
                <option value="Player">Player</option>
              </select>
            </div>
            <div className="mt-2">
              {clubName && position && (
                <SportsDetails clubName={clubName} position={position} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSignIn;
