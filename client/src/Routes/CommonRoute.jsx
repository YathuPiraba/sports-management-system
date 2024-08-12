import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import MemberRoute from "./MemberRoute";
import RootLayout from "../Layout/RootLayout";
import Settings from "../Pages/Settings/Settings";
import Events from "../Pages/Events/Events";
import Club from "../Pages/Club/Club";
import PageNotFound from "../Pages/PageNotFound";

const CommonRoute = () => {
  const role_id = useSelector((state) => state.auth.userdata.role_id);

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {role_id === 1 && <Route path="/*" element={<AdminRoute />} />}
        {role_id === 2 && <Route path="/*" element={<ManagerRoute />} />}
        {role_id === 3 && <Route path="/*" element={<MemberRoute />} />}
        <Route path="/settings" element={<Settings />} />
        <Route path="/events" element={<Events />} />
        <Route path="/club" element={<Club />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default CommonRoute;
