import React from 'react'
import { Route, Routes } from "react-router-dom";
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import ManagerClub from '../pages/manager/ManagerClub';
import ManagerEvents from '../pages/manager/ManagerEvents';

const ManagerRoute = () => {
  return (
    <Routes>
    <Route path="/manager" >
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="club" element={<ManagerClub />} />
        <Route path="events" element={<ManagerEvents />} />
      </Route>
  </Routes>
  )
}

export default ManagerRoute