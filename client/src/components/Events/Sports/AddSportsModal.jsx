import React, { useState } from "react";
import { Modal } from "antd";

const AddSportsModal = ({ visible, onCancel, onAdd }) => {
  const [sportName, setSportName] = useState("");

  const handleAdd = () => {
    if (sportName) {
      onAdd({ name: sportName, image: "/api/placeholder/100/100" });
      setSportName("");
      onCancel();
    }
  };

  return (
    <Modal
      title="Add New Sport"
      visible={visible}
      onCancel={onCancel}
      onOk={handleAdd}
      okText="Add Sport"
    >
      <input
        className="w-full p-2 border rounded"
        value={sportName}
        onChange={(e) => setSportName(e.target.value)}
        placeholder="Enter sport name"
      />
    </Modal>
  );
};

export default AddSportsModal;
