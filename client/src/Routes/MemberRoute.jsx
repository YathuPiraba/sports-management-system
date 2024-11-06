import React from "react";
import { Route, Routes } from "react-router-dom";
// import MemberDashboard from "../Pages/Member/MemberDashboard";
import PageNotFound from "../Pages/PageNotFound";
import ManagerClub from "../Pages/Club/ManagerClub";
import MemberSettings from "../Pages/Settings/MemberSettings";

const MemberRoute = () => {
  return (
    <Routes>
      <Route path="/member">
        {/* <Route path="dashboard" element={<MemberDashboard />} /> */}
        <Route path="club" element={<ManagerClub />} />
        <Route path="settings" element={<MemberSettings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default MemberRoute;
