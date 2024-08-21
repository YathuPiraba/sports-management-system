import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClubsAPI, fetchGSDataApi } from "../../Services/apiServices";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import PersonalDetails from "../../Components/Signup/PersonalDetails";
import SportsDetails from "../../Components/Signup/SportsDetails";
import SignInHeader from "../../Components/Signup/SignInHeader";
import { applyMember } from "../../features/authslice";

const MemberSignIn = () => {
  const [divisions, setDivisions] = useState([]);
  const [memberDetails, setMemberDetails] = useState({
    userName: "",
    email: "",
    password: "",
    image: null,
    firstName: "",
    lastName: "",
    date_of_birth: "",
    divisionName: "",
    address: "",
    nic: "",
    contactNo: "",
    whatsappNo: "",
    confirm_password: "",
  });

  const [sportsDetails, setSportsDetails] = useState({
    clubName: "",
    position: "",
    selectedSport: "",
    selectedSkills: [],
    experience: "",
  });

  const [clubs, setClubs] = useState([]);
  const [currentStep, setCurrentStep] = useState("personalDetails");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchGsData = async () => {
    try {
      const res = await fetchGSDataApi();
      setDivisions(res.data.data);
    } catch (error) {
      console.error("Error fetching Gs divisions data:", error);
    }
  };

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

  const handleSportsDetailsChange = (data) => {
    setSportsDetails(data);
  };

  const applyRequest = async () => {
    const { confirm_password, ...filteredMemberDetails } = memberDetails;
    const formData = new FormData();

    // Append the filtered memberDetails to formData
    Object.keys(filteredMemberDetails).forEach((key) => {
      if (filteredMemberDetails[key]) {
        formData.append(key, filteredMemberDetails[key]);
      }
    });

    // Handle image separately to ensure it's a file object
    if (memberDetails.image) {
      formData.append("image", memberDetails.image);
    }

    // Append sportsDetails to formData
    formData.append("clubName", sportsDetails.clubName);
    formData.append("position", sportsDetails.position);
    formData.append(
      "experience",
      sportsDetails.position === "Coach" ? sportsDetails.experience : ""
    );

    // Construct the sports array and append it to formData
    if (sportsDetails.selectedSport) {
      formData.append(
        "sports[]",
        JSON.stringify({
          id: sportsDetails.selectedSport,
          skills:
            sportsDetails.selectedSkills.length > 0
              ? sportsDetails.selectedSkills
              : [],
        })
      );
    }

    try {
      const result = await dispatch(applyMember(formData)).unwrap();
      console.log("result", result);
      navigate("/home");
      toast.success("Successfully Applied for Registration");
      localStorage.removeItem("memberSignInData");
    } catch (error) {
      console.error("Error creating request", error);
      toast.error("Error while applying Request");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (memberDetails.password !== memberDetails.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    applyRequest();
  };

  const handleMemberChange = (e) => {
    const { name, value, files } = e.target;
    setMemberDetails({ ...memberDetails, [name]: files ? files[0] : value });
  };

  useEffect(() => {
    // Load data from local storage when component mounts
    const storedData = JSON.parse(localStorage.getItem("memberSignInData"));
    if (storedData) {
      setMemberDetails(storedData.memberDetails || {});
      setSportsDetails(storedData.sportsDetails || {});
    }
  }, []);

  const handleNextStep = () => {
    localStorage.setItem(
      "memberSignInData",
      JSON.stringify({
        memberDetails,
        sportsDetails,
      })
    );
    setCurrentStep("sportsDetails");
  };

  const handlePreviousStep = () => {
    localStorage.setItem(
      "memberSignInData",
      JSON.stringify({
        memberDetails,
        sportsDetails,
      })
    );
    setCurrentStep("personalDetails");
  };

  return (
    <div className="min-h-screen bg-customGreen text-black">
      <h1 className="p-4 font-poppins text-xl font-bold underline text-gray-900">
        Member SignIn Form
      </h1>
      <SignInHeader currentStep={currentStep} />
      <form onSubmit={handleSubmit}>
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
            <div className="m-6 max-h-screen w-3/4 py-9 px-2 z-20 bg-white text-black shadow-md border">
              <div className="flex justify-start mt-3 ml-4">
                <button
                  onClick={handlePreviousStep}
                  className="bg-blue-500 text-white px-2 py-1 border rounded-md"
                >
                  Previous
                </button>
              </div>
              <div>
                <SportsDetails
                  clubs={clubs}
                  onSportsDetailsChange={handleSportsDetailsChange}
                />
              </div>
              <div className="flex justify-end mt-3 ml-4 mr-5">
                <button
                  className="bg-green-500 text-white px-2 py-1 border rounded-md"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MemberSignIn;
