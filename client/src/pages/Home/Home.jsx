import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import echo from "../../utils/echo";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const authenticate = useSelector((state) => state.auth.userdata);
  const navigate = useNavigate();

  console.log(authenticate);

  const [verified, setVerified] = useState(authenticate.is_verified);

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
    <div>
      <h1>Welcome to Our Club</h1>
      <p>Some static information here.</p>
      {verified === 0 ? (
        <p>You are still under verification.</p>
      ) : (
        <p>
          You are verified. <Link to="/login">Click here to log in.</Link>
        </p>
      )}
    </div>
  );
};

export default Home;
