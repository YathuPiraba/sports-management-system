import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Welcome.css";
import frontPic from "../assets/cover.png";

const Welcome = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth.token;
  const user = auth?.userdata;
  const role_id = user?.role_id;

  useEffect(() => {
    if (isAuthenticated) {
      switch (role_id) {
        case 1:
          navigate("/admin/dashboard", { replace: true });
          break;
        case 2:
          navigate("/manager/club", { replace: true });
          break;
        case 3:
          navigate("/member/club", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
          break;
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="welcome-container relative">
      {/* Main content container */}
      <div className="relative z-10 w-full h-screen flex items-center pl-2">
        {/* Left content */}
        <div className="welLeft relative pl-2 md:pr-8 lg:pl-10 z-10">
          <div className="welTitle  mb-2">
            <h1 className="font-bold text-white">CLUB</h1>
            <h1 className="font-bold text-orange-500 weltext">CONNECT</h1>
          </div>
          <p className="text-gray-300 text-xl font-roboto font-semibold w-full mb-4 max-w-lg">
            Your one-stop solution for managing sports events and teams in
            Valikamam South Divisional Secretariat.
          </p>
          <div className="welLogin">
          <Link to="/login">
            <button
              className="bg-orange-500 text-white px-8 py-3 rounded-full 
                             font-semibold hover:bg-orange-600 transition-colors 
                             duration-300 shadow-lg"
            >
              LOGIN
            </button>
          </Link>
          </div>
        </div>

        {/* Image container with hover effect */}
        <div className="welRight group relative  overflow-hidden imgcont">
          <img
            src={frontPic}
            alt="Sports"
            className="w-full h-[100vh] object-cover object-center rounded-lg transform 
                         transition-transform duration-700 ease-in-out scale-90 
                         group-hover:scale-95"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
