/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import fb from "../../assets/Facebook.png";
import google from "../../assets/google.svg";
import { FacebookAuth, GoogleAuth } from "../../pages/login/config";
import { useNavigate } from "react-router-dom";
import { login, loginAdmin } from "../../features/authslice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

const FbGmailSignin = () => {
  const navigate = useNavigate();

  const hashString = async (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleFacebookClick = async () => {
    try {
      const user = await FacebookAuth();
      const accessToken = user.user.accessToken

      const hashedToken = await hashString(accessToken);
      console.log("Hashed Token:", hashedToken);

      localStorage.setItem("accessToken", hashedToken);
      navigate("/");
   
    } catch (error) {
      console.log({ error });
    }
  };

  const handleGoogleClick = async () => {
    try {
      const result = await GoogleAuth();
      const accessToken = result.user.accessToken;


      const hashedToken = await hashString(accessToken);
      console.log("Hashed Token:", hashedToken);

      localStorage.setItem("accessToken", hashedToken );
      navigate("/");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <div className="ex-login">
        <button onClick={handleFacebookClick}>
          <img src={fb} alt="Facebook" />{" "}
        </button>
        <button onClick={handleGoogleClick}>
          {" "}
          <img src={google} alt="Google" />{" "}
        </button>
      </div>
    </>
  );
};

export default FbGmailSignin;
