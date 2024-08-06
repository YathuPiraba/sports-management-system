import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import MemberRoute from "./MemberRoute";
import RootLayout from "../Layout/RootLayout";

const CommonRoute = () => {
  const role_id = useSelector((state) => state.auth.userdata.user.role_id);
  console.log("role id", role_id);
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {role_id === 1 && <Route path="/*" element={<AdminRoute />} />}
        {role_id === 2 && <Route path="/*" element={<ManagerRoute />} />}
        {role_id && role_id !== 1 && role_id !== 2 && (
          <Route path="/*" element={<MemberRoute />} />
        )}
      </Route>
    </Routes>
  );
};

export default CommonRoute;
