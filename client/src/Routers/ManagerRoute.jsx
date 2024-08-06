import React from 'react'
import { Route, Routes } from "react-router-dom";
import Manager from '../pages/manager/Manager';

const ManagerRoute = () => {
  return (
    <Routes>
    <Route path="/manager" element={<Manager />} />
  </Routes>
  )
}

export default ManagerRoute