import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth.token;
  const isVerified = auth.userdata.is_verified === 1;

  console.log('Is Authenticated:', isAuthenticated);
  console.log('Is Verified:', isVerified);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isVerified) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;