import React from 'react'
import { useSelector } from "react-redux";

const Events = () => {
  const role_id = useSelector((state) => state.auth.userdata.role_id);
  return (
    <div className='px-6'>Events </div>
  )
}

export default Events