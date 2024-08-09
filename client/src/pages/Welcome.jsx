import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div>
      Welcome
      <p>
        <Link to="/login">Click here to log in.</Link>
      </p>
    </div>
  );
};

export default Welcome;
