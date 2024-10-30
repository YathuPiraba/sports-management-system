import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
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
          navigate("/member/dashboard", { replace: true });
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
      <div className="relative z-10 w-full h-screen flex items-center px-8 md:px-16">
        {/* Left content */}
        <div className="w-1/2 pr-8">
          <h1 className="text-6xl font-bold text-white mb-2">
            CLUB
            <br />
            <span className="text-orange-500">CONNECT</span>
          </h1>
          <p className="text-gray-300 mb-8 max-w-lg">
            Your one-stop solution for managing sports events and teams in
            Valikamam South Divisional Secretariat.
          </p>
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

        {/* Right content - Image */}
        <div className="w-1/2 relative overflow-hidden rounded-lg">
          {/* Decorative arrows */}
          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 z-10">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-24 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 transform -skew-x-12"
                />
              ))}
            </div>
          </div>

          {/* Image container with hover effect */}
          <div className="group relative w-full  overflow-hidden rounded-lg">
            <div className="absolute inset-0 transition-colors duration-300 z-10" />
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

    </div>
  );
};

export default Welcome;
