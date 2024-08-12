import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth.token;

  console.log("Is Authenticated:", isAuthenticated);


  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated) {
    const isVerified = auth.userdata.is_verified;
    
    if (isVerified == 0) {
      return <Navigate to="/home" />;
    }

    return <Component {...rest} />;
  }
};

export default ProtectedRoute;
