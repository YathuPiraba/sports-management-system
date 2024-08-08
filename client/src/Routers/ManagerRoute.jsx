import React from 'react'
import { Route, Routes } from "react-router-dom";
import ManagerDashboard from '../pages/Manager/ManagerDashboard';



const ManagerRoute = () => {
  return (
    <Routes>
    <Route path="/manager" >
        <Route path="dashboard" element={<ManagerDashboard />} />
      </Route>
  </Routes>
  )
}

export default ManagerRoute