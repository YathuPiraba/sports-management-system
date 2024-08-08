import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminClubs from "../pages/admin/AdminClubs";
import AdminEvents from "../pages/admin/AdminEvents";

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/admin" >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clubs" element={<AdminClubs />} />
        <Route path="events" element={<AdminEvents />} />
      </Route>
    </Routes>
  );
};

export default AdminRoute;
