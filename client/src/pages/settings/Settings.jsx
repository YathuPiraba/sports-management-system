import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChangePassword from "../../Components/admin/ChangePassword";
import UpdateProfile from "../../Components/admin/UpdateProfile";
import GridLoader from "react-spinners/GridLoader";
import { fetchUserDetails } from "../../features/authslice"; 


const Settings = () => {

  return (
    <>
      <div>Settings</div>
      <div>
        {/* <UpdateProfile /> */}
      </div>
    </>
  );
};

export default Settings;
