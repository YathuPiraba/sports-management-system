import React from "react";
import { Route, Routes } from "react-router-dom";
import MemberDashboard from "../pages/Member/MemberDashboard";
import PageNotFound from "../pages/PageNotFound";

const MemberRoute = () => {
  return (
    <Routes>
      <Route path="/member">
        <Route path="dashboard" element={<MemberDashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default MemberRoute;
