import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import echo from "../../utils/echo";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../App.css"

const Home = () => {
  const authenticate = useSelector((state) => state.auth.userdata);
  const navigate = useNavigate();

  console.log("aut", authenticate);

  const [verified, setVerified] = useState(authenticate?.is_verified);

  useEffect(() => {
    const channel = echo.channel("reject");

    // Listen for real-time updates
    channel.listen(".user-rejection", (event) => {
      console.log("New user applied:", event.userId);

      if (authenticate.userId == event.userId) {
        navigate("/");
        toast.error("Sorry your request is rejected");
      }
    });

    channel.subscribed(() => {
      console.log("Subscribed to the reject channel");
    });

    channel.error((error) => {
      console.error("Subscription error:", error);
    });

    return () => {
      echo.leaveChannel("reject");
    };
  }, [authenticate.userId, navigate]);

  useEffect(() => {
    const channel = echo.channel("users");

    // Listen for real-time updates
    channel.listen(".user-verification", (event) => {
      console.log("New user applied:", event.userId);

      if (authenticate.userId == event.userId) {
        setVerified(1);
      }
    });

    channel.subscribed(() => {
      console.log("Subscribed to the users channel");
    });

    channel.error((error) => {
      console.error("Subscription error:", error);
    });

    return () => {
      echo.leaveChannel("users");
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 animate-slide bg-cover bg-center"></div>

      {/* Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-50 p-6">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-4">
            Welcome to Our Club
          </h1>
          <p className="text-gray-700 text-center mb-6">
            This is an official portal for managing sports activities, clubs,
            and events.
          </p>
          <div className="bg-blue-50 p-4 rounded-md text-center mb-4">
            {verified === 0 ? (
              <p className="text-red-600 font-medium">
                You are still under verification. Please check back later.
              </p>
            ) : (
              <p className="text-green-700 font-medium">
                You are verified.{" "}
                <Link to="/login" className="text-blue-700 underline">
                  Click here to log in.
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
