import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import RootLayout from "./Layout/RootLayout";
import Home from "./pages/Home/Home";
import Admin from "./pages/admin/Admin";
import Manager from "./pages/manager/Manager";
import ManagerSignIn from "./pages/signup/ManagerSignIn";
import MemberSignIn from "./pages/signup/MemberSignIn";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/manager" element={<Manager/>} />
            <Route path="/signup/manager" element={<ManagerSignIn/>} />
            <Route path="/signup/member" element={<MemberSignIn/>} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;