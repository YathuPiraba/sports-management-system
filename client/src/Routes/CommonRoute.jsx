import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import MemberRoute from "./MemberRoute";
import RootLayout from "../Layout/RootLayout";
import Events from "../Pages/Events/Events";
import PageNotFound from "../Pages/PageNotFound";
import MemberProfile from "../Pages/Member/MemberProfile";

const CommonRoute = () => {
  const user = useSelector((state) => state.auth.userdata);
  const role_id = user?.role_id;

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {role_id === 1 && <Route path="/*" element={<AdminRoute />} />}
        {role_id === 2 && <Route path="/*" element={<ManagerRoute />} />}
        {role_id === 3 && <Route path="/*" element={<MemberRoute />} />}
        <Route path="/events" element={<Events />} />
        <Route path="/club/member/:memberId" element={<MemberProfile />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default CommonRoute;
