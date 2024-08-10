import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminClubs from "../Pages/Admin/AdminClubs";
import AdminApprovals from "../Pages/Admin/AdminApprovals";
import PageNotFound from "../Pages/PageNotFound";

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/admin">
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clubs" element={<AdminClubs />} />
        <Route path="approvals" element={<AdminApprovals />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AdminRoute;
