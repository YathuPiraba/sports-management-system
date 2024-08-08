import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminClubs from "../pages/Admin/AdminClubs";


const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/admin" >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clubs" element={<AdminClubs />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
