import React from "react";
import { Route, Routes } from "react-router-dom";
import MemberDashboard from "../Pages/Member/MemberDashboard";
import PageNotFound from "../Pages/PageNotFound";
import ManagerClub from "../Pages/Club/ManagerClub";
import ManagerSettings from "../Pages/Settings/ManagerSettings";

const MemberRoute = () => {
  return (
    <Routes>
      <Route path="/member">
        <Route path="dashboard" element={<MemberDashboard />} />
        <Route path="club" element={<ManagerClub />} />
        <Route path="settings" element={<ManagerSettings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default MemberRoute;
