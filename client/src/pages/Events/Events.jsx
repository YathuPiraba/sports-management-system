import React from 'react'
import { useSelector } from "react-redux";

const Events = () => {
  const role_id = useSelector((state) => state.auth.userdata.user.role_id);
  return (
    <div>Events </div>
  )
}

export default Events