import React, { useState, useEffect } from "react";
import { Button, Table, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EventFormModal from "../../Components/Events/EventFormModal";
import { getEventAPI, deleteEventAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await getEventAPI();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events.");
    }
  };

  useEffect(() => {
    // Fetch events when component mounts
    fetchEvents();
  }, []);

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

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEventAPI(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
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
              Modal.confirm({
                title: "Are you sure you want to delete this event?",
                onOk: () => handleDeleteEvent(record.id),
              });
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
        open={isEventModalVisible}
        onOk={handleEventModalOk}
        onCancel={handleEventModalCancel}
        event={selectedEvent}
        fetchEvents={fetchEvents}
      />
    </div>
  );
};

export default Events;
