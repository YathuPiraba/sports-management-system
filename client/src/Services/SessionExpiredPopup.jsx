import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";

const SessionExpiredPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
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
