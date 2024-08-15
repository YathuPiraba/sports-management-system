import React from "react";
import { Route, Routes } from "react-router-dom";
import ManagerDashboard from "../Pages/Manager/ManagerDashboard";
import PageNotFound from "../Pages/PageNotFound";
import ManagerSettings from "../Pages/Settings/ManagerSettings";
import ClubMembers from "../Pages/Manager/ClubMembers";
import ManagerClub from "../Pages/Club/ManagerClub";

const ManagerRoute = () => {
  return (
    <Routes>
      <Route path="/manager">
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="approvals" element={<ManagerDashboard />} />
        <Route path="settings" element={<ManagerSettings />} />
        <Route path="members" element={<ClubMembers />} />
        <Route path="club" element={<ManagerClub />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default ManagerRoute;
