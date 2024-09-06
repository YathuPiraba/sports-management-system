import React, { useState, useEffect, Suspense, lazy } from "react";
import { Button, Select, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAEventAPI,
  getAllEventAPI,
  deleteEventAPI,
} from "../../Services/apiServices";
import toast from "react-hot-toast";

const EventFormModal = lazy(() =>
  import("../../Components/Events/EventFormModal")
);
const SportsCard = lazy(() =>
  import("../../Components/Events/Sports/SportsCard")
);
const AddSportsCard = lazy(() =>
  import("../../Components/Events/Sports/AddSportsCard")
);
const SportsFormModal = lazy(() =>
  import("../../Components/Events/Sports/SportsFormModal")
);

const { Option } = Select;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState({});
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isSportModalVisible, setIsSportModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleDeleteEvent = async () => {
    try {
      await deleteEventAPI(selectedEvent);
      setSelectedEvent(null);
      setSelectedEventDetails({});
      fetchEvents();
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  const showEventModal = (isEditingMode = false) => {
    setIsEditing(isEditingMode); // Set the mode to add or edit
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-4">Event Management</h1>
        <div className="flex mb-4 space-x-2">
          <Button
            icon={<PlusOutlined />}
            onClick={() => showEventModal(false)}
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
            <>
              <Button
                onClick={() => showEventModal(true)}
                className="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                icon={<EditOutlined />}
              >
                Edit Event
              </Button>
              {/* <Popconfirm
                title="Are you sure you want to delete this event?"
                onConfirm={handleDeleteEvent}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className="bg-red-500 text-white hover:bg-red-600"
                  icon={<DeleteOutlined />}
                >
                  Delete Event
                </Button>
              </Popconfirm> */}
            </>
          )}
        </div>
        {selectedEvent && (
          <div className="bg-white p-6  border-2 border-blue-500  rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-black text-center mb-4">
              {selectedEventDetails.name}
            </h2>
            <p>{selectedEventDetails.start_date}</p>
            <p>{selectedEventDetails.end_date}</p>
            <div className="flex flex-wrap justify-center mb-4">
              {selectedEventDetails.event_sports?.map((sport) => (
                <SportsCard
                  key={sport.id}
                  name={sport.sports_name}
                  image={sport.sports_image}
                  onEdit={() => alert("Edit Sport not implemented")}
                  onDelete={() => {
                    setSelectedEventDetails((prevDetails) => ({
                      ...prevDetails,
                      event_sports: prevDetails.event_sports.filter(
                        (s) => s.id !== sport.id
                      ),
                    }));
                  }}
                />
              ))}
              <AddSportsCard onClick={() => setIsSportModalVisible(true)} />
            </div>
          </div>
        )}

        <EventFormModal
          open={isEventModalVisible}
          onOk={handleEventModalOk}
          onCancel={handleEventModalCancel}
          event={
            isEditing
              ? events.find((event) => event.id === selectedEvent)
              : null
          }
          fetchEvents={fetchEvents}
          fetchEventDetails={fetchEventDetails}
        />

        <SportsFormModal
          visible={isSportModalVisible}
          onCancel={() => setIsSportModalVisible(false)}
          onAdd={handleAddSport}
          fetchEvents={fetchEvents}
          fetchEventDetails={fetchEventDetails}
        />
      </div>
    </Suspense>
  );
};

export default Events;
