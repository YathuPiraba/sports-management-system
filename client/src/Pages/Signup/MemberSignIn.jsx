import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClubsAPI, fetchGSDataApi } from "../../Services/apiServices";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { applyMember } from "../../features/authslice";
import { TbPlayerTrackPrev } from "react-icons/tb";
import useGsDivisions from "../../hooks/useGsDivisions";
import { FadeLoader } from "react-spinners";

const SignInHeader = lazy(() => import("../../Components/Signup/SignInHeader"));
const PersonalDetails = lazy(() =>
  import("../../Components/Signup/PersonalDetails")
);
const SportsDetails = lazy(() =>
  import("../../Components/Signup/SportsDetails")
);

const MemberSignIn = () => {
  const { divisions } = useGsDivisions();
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
  const loading = useSelector((state) => state.auth.loading);

  const fetchAllClubs = async () => {
    try {
      const res = await getAllClubsAPI();
      setClubs(res.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  useEffect(() => {
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
      if (filteredMemberDetails[key] && key !== "image") {
        formData.append(key, filteredMemberDetails[key]);
      }
    });

    // Handle image separately to ensure it's a file object
    if (memberDetails.image instanceof File) {
      formData.append("image", memberDetails.image);
    } else {
      console.warn("Image is not a valid file object");
    }

    // Append sportsDetails to formData
    formData.append("clubName", sportsDetails.clubName);
    formData.append("position", sportsDetails.position);

    if (sportsDetails.position === "Coach") {
      formData.append("experience", sportsDetails.experience || "");
      // For coaches, we'll send a single sport
      formData.append("sports[0][id]", sportsDetails.selectedSport);
    } else if (sportsDetails.position === "Player") {
      // For players, we need to construct the sports array
      if (Array.isArray(sportsDetails.selectedSkills)) {
        sportsDetails.selectedSkills.forEach((sportSkill, index) => {
          formData.append(`sports[${index}][id]`, sportSkill.sport);
          formData.append(`sports[${index}][skills][]`, sportSkill.skill || "");
        });
      } else if (sportsDetails.selectedSport && sportsDetails.selectedSkills) {
        // If selectedSkills is not an array, but we have selectedSport and selectedSkills
        formData.append("sports[0][id]", sportsDetails.selectedSport);
        formData.append("sports[0][skills][]", sportsDetails.selectedSkills);
      }
    }

    try {
      const result = await dispatch(applyMember(formData)).unwrap();
      console.log("result", result);
      navigate("/home");
      toast.success("Successfully Applied for Registration");
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

  const handleNextStep = () => {
    setCurrentStep("sportsDetails");
  };

  const handlePreviousStep = () => {
    setCurrentStep("personalDetails");
  };

  return (
    <Suspense fallback={<div className="bg-customGreen">Loading...</div>}>
      <div className="min-h-screen bg-customGreen  text-black ">
        <SignInHeader currentStep={currentStep} />
        <form onSubmit={handleSubmit} className="mt-3 px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm z-50">
              <FadeLoader className="ml-1 mt-1" color="skyblue" />
            </div>
          )}
          <div className=" mx-auto min-w-[700px]">
            <div className="bg-white text-black shadow-md border rounded-lg overflow-hidden w-full mb-3">
              <h1 className="text-xl font-poppins py-5 font-bold text-center">
                Member SignIn Form
              </h1>
              <div className="px-4 sm:px-6 lg:px-8 pb-8">
                {currentStep === "personalDetails" && (
                  <PersonalDetails
                    details={memberDetails}
                    handleChange={handleMemberChange}
                    divisions={divisions}
                    onNextStep={handleNextStep}
                  />
                )}

                {currentStep === "sportsDetails" && (
                  <>
                    <div className="flex justify-start mt-3">
                      <button
                        onClick={handlePreviousStep}
                        className="bg-blue-500 text-white px-4 py-2 lg:px-5 lg:py-2 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        <TbPlayerTrackPrev size={18} />
                      </button>
                    </div>
                    <div className="mt-4">
                      <SportsDetails
                        clubs={clubs}
                        onSportsDetailsChange={handleSportsDetailsChange}
                      />
                    </div>

                    <div className="flex justify-center  mt-6">
                      <button
                        className="bg-green-500 text-white px-4 py-2 w-max md:w-56 lg:w-64 rounded-md hover:bg-green-600 transition-colors"
                        type="submit"
                      >
                        Apply
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Suspense>
  );
};

export default MemberSignIn;
