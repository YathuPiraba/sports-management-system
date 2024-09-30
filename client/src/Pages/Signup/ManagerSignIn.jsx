import React, { useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { applyManager } from "../../features/authslice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TbPlayerTrackPrev } from "react-icons/tb";
import useGsDivisions from "../../hooks/useGsDivisions";
import { Button } from "antd";
import "../../App.css";

const SignInHeader = lazy(() => import("../../Components/Signup/SignInHeader"));
const PersonalDetails = lazy(() =>
  import("../../Components/Signup/PersonalDetails")
);
const ClubDetails = lazy(() => import("../../Components/Signup/ClubDetails"));

const ManagerSignIn = () => {
  const { divisions } = useGsDivisions();
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

  const [currentStep, setCurrentStep] = useState("personalDetails");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  // const loading = true;
  const handleNextStep = () => {
    setCurrentStep("clubDetails");
  };

  const handlePreviousStep = () => {
    setCurrentStep("personalDetails");
  };

  const applyRequest = async () => {
    let { confirm_password, ...formData } = {
      ...clubDetails,
      ...managerDetails,
    };
    try {
      const result = await dispatch(applyManager(formData)).unwrap();
      console.log("result", result);
      toast.success("Successfully Applied for Registration");
      navigate("/home");
    } catch (error) {
      console.error("Error creating request", error);
      toast.error(error?.message);
    }
  };

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
    if (managerDetails.password !== managerDetails.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    applyRequest();
  };

  return (
    <Suspense fallback={<div className="bg-customGreen"> Loading...</div>}>
      <div className="p-6 bg-customGreen min-h-screen">
        <SignInHeader currentStep={currentStep} />
        <form onSubmit={handleSubmit} className="mt-3 px-4 sm:px-6 lg:px-8">
          {currentStep === "personalDetails" && (
            <div className="w-auto mx-auto">
              <div className="bg-white text-black shadow-md border rounded-lg overflow-hidden w-full mb-3">
                <h1 className="text-xl font-poppins py-5 font-bold text-center">
                  Manager SignIn Form
                </h1>
                <div className="px-4 sm:px-6 lg:px-8 pb-8">
                  <PersonalDetails
                    details={managerDetails}
                    handleChange={handleManagerChange}
                    divisions={divisions}
                    onNextStep={handleNextStep}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === "clubDetails" && (
            <div className="w-auto mx-auto">
              <div className="bg-white text-black shadow-md border rounded-lg overflow-hidden w-full mb-3">
                <h1 className="text-xl font-poppins pt-5 font-bold text-center">
                  Club Details
                </h1>
                <div className="flex justify-start ml-2 my-3">
                  <button
                    onClick={handlePreviousStep}
                    className="bg-blue-500 text-white px-4 py-2 lg:px-5 lg:py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <TbPlayerTrackPrev size={18} />
                  </button>
                </div>
                <div className="px-4 sm:px-6 w-full lg:px-8 pb-8">
                  <ClubDetails
                    details={clubDetails}
                    handleChange={handleClubChange}
                    divisions={divisions}
                  />
                  <div className="text-center mt-6">
                    <Button
                      htmlType="submit"
                      className="bg-green-500 text-white px-4 py-2 w-full rounded-md signinbtn transition-colors"
                      loading={loading}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Suspense>
  );
};

export default ManagerSignIn;
