import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
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