import React from "react";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "../Pages/PageNotFound";
import ManagerSettings from "../Pages/Settings/ManagerSettings";
import ClubMembers from "../Pages/Manager/ClubMembers";
import ManagerClub from "../Pages/Club/ManagerClub";
import ManagerApprovals from "../Pages/Manager/ManagerApprovals";

const ManagerRoute = () => {
  return (
    <Routes>
      <Route path="/manager">
        <Route path="approvals" element={<ManagerApprovals />} />
        <Route path="settings" element={<ManagerSettings />} />
        <Route path="members" element={<ClubMembers />} />
        <Route path="club" element={<ManagerClub />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default ManagerRoute;
