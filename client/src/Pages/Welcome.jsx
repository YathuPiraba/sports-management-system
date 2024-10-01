import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">
        Welcome to Sports Management System
      </h1>
      <p className="text-lg mb-6 text-gray-700">
        Your one-stop solution for managing sports events and teams in Valikamam
        South Divisional Secretariat.
      </p>
      <Link to="/login">
        <button className="bg-blue-500 text-white rounded-md px-6 py-3 text-lg hover:bg-blue-600 transition duration-300">
          Log In
        </button>
      </Link>
    </div>
  );
};

export default Welcome;
