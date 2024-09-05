import React, { useState } from "react";
import { Button, Table } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EventFormModal from "../../Components/Events/EventFormModal";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const showEventModal = () => {
    setIsEventModalVisible(true);
  };

  const handleEventModalOk = () => {
    // Logic to add/edit event
    setIsEventModalVisible(false);
  };

  const handleEventModalCancel = () => {
    setIsEventModalVisible(false);
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span className="space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedEvent(record);
              showEventModal();
            }}
            className="text-blue-500 hover:text-blue-700"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              /* Delete logic */
            }}
            className="text-red-500 hover:text-red-700"
          />
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>
      <Button
        icon={<PlusOutlined />}
        onClick={showEventModal}
        className="mb-4 bg-blue-500 text-white hover:bg-blue-600"
      >
        Add Event
      </Button>
      <Table
        dataSource={events}
        columns={columns}
        rowKey="id"
        className="w-full"
      />
      <EventFormModal
        visible={isEventModalVisible}
        onOk={handleEventModalOk}
        onCancel={handleEventModalCancel}
        event={selectedEvent}
      />
    </div>
  );
};
export default Events;
