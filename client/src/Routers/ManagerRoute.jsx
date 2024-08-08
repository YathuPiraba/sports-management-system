import React from "react";
import { Route, Routes } from "react-router-dom";
import ManagerDashboard from "../pages/Manager/ManagerDashboard";
import PageNotFound from "../pages/PageNotFound";

const ManagerRoute = () => {
  return (
    <Routes>
      <Route path="/manager">
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="approvals" element={<ManagerDashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default ManagerRoute;
