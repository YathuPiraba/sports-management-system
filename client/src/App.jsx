import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import ManagerSignIn from "./Pages/Signup/ManagerSignIn";
import MemberSignIn from "./Pages/Signup/MemberSignIn";
import CommonRoute from "./Routes/CommonRoute";
import ProtectedRoute from "./Routes/ProtectedRoute";
import Welcome from "./Pages/Welcome";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/manager" element={<ManagerSignIn />} />
          <Route path="/signup/member" element={<MemberSignIn />} />
          <Route path="/*" element={<ProtectedRoute element={CommonRoute} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
