import React from 'react'
import { useSelector } from "react-redux";

const Settings = () => {
  const role_id = useSelector((state) => state.auth.userdata.role_id);
  return (
    <div>Settings</div>
  )
}

export default Settings