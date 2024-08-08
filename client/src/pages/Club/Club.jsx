import React from 'react'
import { useSelector } from "react-redux";

const Club = () => {
  const role_id = useSelector((state) => state.auth.userdata.user.role_id);
  return (
    <div>Club</div>
  )
}

export default Club