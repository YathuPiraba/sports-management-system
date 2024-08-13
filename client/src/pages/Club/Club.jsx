import React from 'react'
import { useSelector } from "react-redux";

const Club = () => {
  const role_id = useSelector((state) => state.auth.userdata.role_id);
  return (
    <div className='px-6'>Club</div>
  )
}

export default Club