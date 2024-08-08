import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import ManagerSignIn from "./pages/Signup/ManagerSignIn";
import MemberSignIn from "./pages/Signup/MemberSignIn";
import CommonRoute from "./Routers/CommonRoute";
import ProtectedRoute from "./Routers/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<ProtectedRoute element={CommonRoute} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/manager" element={<ManagerSignIn />} />
          <Route path="/signup/member" element={<MemberSignIn />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
