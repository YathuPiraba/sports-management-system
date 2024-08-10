import React from "react";
import { Route, Routes } from "react-router-dom";
import MemberDashboard from "../Pages/Member/MemberDashboard";
import PageNotFound from "../Pages/PageNotFound";

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
