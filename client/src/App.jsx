import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/Home/Home";
import ManagerSignIn from "./pages/signup/ManagerSignIn";
import MemberSignIn from "./pages/signup/MemberSignIn";

import CommonRoute from "./Routers/CommonRoute";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<CommonRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/manager" element={<ManagerSignIn />} />
          <Route path="/signup/member" element={<MemberSignIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
