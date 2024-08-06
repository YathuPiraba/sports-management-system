import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "../pages/admin/Admin";

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default AdminRoute;
