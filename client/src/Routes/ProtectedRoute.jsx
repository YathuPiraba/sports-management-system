import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const verified = useSelector((state) => state.auth.userdata.is_verified);

  console.log(verified);
  

  if (verified === 0) {
    // Not verified, redirect to home
    return <Navigate to="/" />;
  }

  // Authenticated render the protected component
  return <Component {...rest} />;
};

export default ProtectedRoute;
