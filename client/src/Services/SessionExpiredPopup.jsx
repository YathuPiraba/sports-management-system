import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import { useDispatch } from "react-redux";
import { logout, logOutAdmin } from "../features/authslice";

const SessionExpiredPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    onClose();
    dispatch(logOutAdmin());
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Modal
      title="Session Expired"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="login" type="primary" onClick={handleLogin}>
          Log In
        </Button>,
      ]}
      centered
      maskClosable={false}
      closable={false}
    >
      <p>Your session has expired. Please log in again to continue.</p>
    </Modal>
  );
};

export default SessionExpiredPopup;
