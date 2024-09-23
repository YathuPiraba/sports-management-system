import React from "react";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { FcSportsMode } from "react-icons/fc";

const SignInHeader = ({ currentStep }) => {
  return (
    <div className=" flex p-3 justify-center">
      <ul className="steps flex gap-4">
        <li
          className={`step ${
            currentStep === "personalDetails" ? "step-primary" : ""
          }`}
        >
          <FaPersonCircleCheck
            size={35}
            className={`step ${
              currentStep === "personalDetails"
                ? "text-blue-600"
                : "text-green-600"
            }`}
          />
        </li>
        <li
          className={`step ${
            currentStep === "sportsDetails" ? "step-primary" : ""
          }`}
        >
          <FcSportsMode size={35} />
        </li>
      </ul>
    </div>
  );
};

export default SignInHeader;
