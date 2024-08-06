import React from 'react'
import { Route, Routes } from "react-router-dom";
import Manager from '../pages/manager/Manager';

const MemberRoute = () => {
  return (
    <Routes>
   
    <Route path="/member" element={<Manager />} />
  </Routes>
  )
}

export default MemberRoute