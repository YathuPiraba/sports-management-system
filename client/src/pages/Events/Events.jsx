import React, { useState, useEffect } from "react";
import { Button, Select, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAEventAPI, getAllEventAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";
import EventFormModal from "../../Components/Events/EventFormModal";

const { Option } = Select;

const SportCard = ({ name, image, onEdit, onDelete }) => (
  <div className="w-24 h-32 bg-white rounded-lg shadow-md flex flex-col items-center justify-center m-2 overflow-hidden">
    <img src={image} alt={name} className="w-16 h-16 object-cover mb-2" />
    <p className="text-xs text-center font-semibold px-1">{name}</p>
    <div className="flex space-x-2 mt-2">
      <Button
        icon={<EditOutlined />}
        onClick={onEdit}
        className="text-blue-500 hover:text-blue-700"
        size="small"
      />
      <Button
        icon={<DeleteOutlined />}
        onClick={onDelete}
        className="text-red-500 hover:text-red-700"
        size="small"
      />
    </div>
  </div>
);

const AddSportCard = ({ onClick }) => (
  <div
    className="w-24 h-32 bg-gray-100 rounded-lg shadow-md flex flex-col items-center justify-center m-2 cursor-pointer hover:bg-gray-200"
    onClick={onClick}
  >
    <PlusOutlined className="text-3xl text-gray-500" />
    <p className="text-xs text-center font-semibold mt-2">Add Sport</p>
  </div>
);

const AddSportModal = ({ visible, onCancel, onAdd }) => {
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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState({});
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isAddSportModalVisible, setIsAddSportModalVisible] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await getAllEventAPI();
      setEvents(response.data);
      if (response.data.length > 0) {
        setSelectedEvent(response.data[response.data.length - 1].id);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEventDetails = async () => {
    if (selectedEvent) {
      try {
        const response = await getAEventAPI(selectedEvent);
        setSelectedEventDetails(response.data || {});
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to fetch event details.");
      }
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [selectedEvent]);

  const showEventModal = () => {
    setIsEventModalVisible(true);
  };

  const handleEventModalOk = () => {
    setIsEventModalVisible(false);
    fetchEvents();
  };

  const handleEventModalCancel = () => {
    setIsEventModalVisible(false);
  };

  const handleAddSport = (newSport) => {
    setSelectedEventDetails((prevDetails) => ({
      ...prevDetails,
      event_sports: [
        ...(prevDetails.event_sports || []),
        { ...newSport, id: Date.now() },
      ],
    }));
  };

  return (
    <div className="px-6">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>
      <div className="flex mb-4 space-x-2">
        <Button
          icon={<PlusOutlined />}
          onClick={showEventModal}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Events
        </Button>
        <Select
          value={selectedEvent}
          onChange={(value) => setSelectedEvent(value)}
          className="w-64"
          placeholder="Select Event"
        >
          {events.map((event) => (
            <Option key={event.id} value={event.id}>
              {event.name}
            </Option>
          ))}
        </Select>
        {selectedEvent && (
          <Button
            onClick={() => alert("Edit Event not implemented")}
            className="bg-blue-500 text-white hover:bg-blue-600 ml-2"
            icon={<EditOutlined />}
          >
            Edit Event
          </Button>
        )}
      </div>
      {selectedEvent && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white text-center mb-4">
            {selectedEventDetails.name}
          </h2>
          <p className="text-white">{selectedEventDetails.start_date}</p>
          <p className="text-white">{selectedEventDetails.end_date}</p>
          <div className="flex flex-wrap justify-center mb-4">
            {selectedEventDetails.event_sports?.map((sport) => (
              <SportCard
                key={sport.id}
                name={sport.sports_name}
                image={sport.sports_image}
                onEdit={() => alert("Edit Sport not implemented")}
                onDelete={() => {
                  // Here you would typically make an API call to delete the sport
                  // For now, we'll just update the local state
                  setSelectedEventDetails((prevDetails) => ({
                    ...prevDetails,
                    event_sports: prevDetails.event_sports.filter(
                      (s) => s.id !== sport.id
                    ),
                  }));
                }}
              />
            ))}
            <AddSportCard onClick={() => setIsAddSportModalVisible(true)} />
          </div>
        </div>
      )}

      <EventFormModal
        open={isEventModalVisible}
        onOk={handleEventModalOk}
        onCancel={handleEventModalCancel}
        event={events.find((event) => event.id === selectedEvent)}
      />

      <AddSportModal
        visible={isAddSportModalVisible}
        onCancel={() => setIsAddSportModalVisible(false)}
        onAdd={handleAddSport}
      />
    </div>
  );
};

export default Events;
