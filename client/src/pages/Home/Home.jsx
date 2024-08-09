import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const authenticate = useSelector((state) => state.auth.userdata);
  
  const verified =authenticate.user.is_verified;
  return (
    <div>
      <h1>Welcome to Our Club</h1>
      <p>Some static information here.</p>
      {verified === false ? (
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
