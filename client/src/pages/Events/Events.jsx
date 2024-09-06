import React, { useState, useEffect, Suspense, lazy } from "react";
import { Button, Select } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { getAEventAPI, getAllEventAPI } from "../../Services/apiServices";
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
const AddSportsModal = lazy(() =>
  import("../../Components/Events/Sports/AddSportsModal")
);

const { Option } = Select;

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
    <Suspense fallback={<div>Loading...</div>}>
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
              <AddSportsCard onClick={() => setIsAddSportModalVisible(true)} />
            </div>
          </div>
        )}

        <EventFormModal
          open={isEventModalVisible}
          onOk={handleEventModalOk}
          onCancel={handleEventModalCancel}
          event={events.find((event) => event.id === selectedEvent)}
        />

        <AddSportsModal
          visible={isAddSportModalVisible}
          onCancel={() => setIsAddSportModalVisible(false)}
          onAdd={handleAddSport}
        />
      </div>
    </Suspense>
  );
};

export default Events;
