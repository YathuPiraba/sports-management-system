import React from "react";
import { Route, Routes } from "react-router-dom";
import MemberDashboard from "../pages/Member/MemberDashboard";

const MemberRoute = () => {
  return (
    <Routes>
      <Route path="/member">
        <Route path="dashboard" element={<MemberDashboard />} />
      </Route>
    </Routes>
  );
};

export default MemberRoute;
