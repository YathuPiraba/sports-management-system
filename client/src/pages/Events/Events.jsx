import React, { useState, useEffect, Suspense, lazy } from "react";
import { Button, Select, Popconfirm, Tabs } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAEventAPI,
  getAllEventAPI,
  deleteEventAPI,
} from "../../Services/apiServices";
import toast from "react-hot-toast";
import GridLoader from "react-spinners/GridLoader";
import { useSelector } from "react-redux";
import "../../Components/Navbar/Navbar.css";

const ClubParticipants = lazy(() =>
  import("../../Components/Events/ClubParticipants")
);
const EventParticipantList = lazy(() =>
  import("../../Components/Events/EventParticipantList")
);
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
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState({});
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isSportModalVisible, setIsSportModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const [selectedSport, setSelectedSport] = useState(null);
  const role_id = useSelector((state) => state.auth.userdata.role_id);

  const handleToggleDiv = () => {
    setShowFirstDiv(!showFirstDiv);
  };

  const fetchEvents = async () => {
    setLoading(true);
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
      setLoading(true);
      try {
        const response = await getAEventAPI(selectedEvent);
        setSelectedEventDetails(response.data || {});
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to fetch event details.");
      } finally {
        setLoading(false);
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
    setIsEditing(isEditingMode);
    setIsEventModalVisible(true);
  };

  const handleEventModalOk = () => {
    setIsEventModalVisible(false);
    fetchEvents();
    fetchEventDetails();
  };

  const handleEventModalCancel = () => {
    setIsEventModalVisible(false);
  };

  const handleSportsModalOk = () => {
    setIsSportModalVisible(false);
    fetchEventDetails();
    setSelectedSport(null);
  };

  const handleSportsModalCancel = () => {
    setIsSportModalVisible(false);
    setSelectedSport(null);
  };

  const handleEditSport = (sport) => {
    setSelectedSport(sport);
    setIsSportModalVisible(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[75vh]">
        <GridLoader
          loading={loading}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#4682B4"
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="px-6">
        <h1 className="text-2xl font-bold mb-4">Event Management</h1>
        <div className="flex mb-4 space-x-2">
          {role_id == 1 && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => showEventModal(false)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Events
            </Button>
          )}
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
              {role_id == 1 && (
                <>
                  <Button
                    onClick={() => showEventModal(true)}
                    className="bg-blue-500 text-white hover:bg-blue-600 ml-2"
                    icon={<EditOutlined />}
                  >
                    Edit Event
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this event?"
                    onConfirm={handleDeleteEvent}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600 ml-2"
                      icon={<DeleteOutlined />}
                    >
                      Delete Event
                    </Button>
                  </Popconfirm>
                </>
              )}
            </>
          )}
        </div>
        <div
          className="p-6 border-2 border-blue-500 rounded-lg shadow-lg "
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dmonsn0ga/image/upload/v1725782081/Blue_and_Yellow_Abstract_Sport_Trivia_Quiz_Presentation_2_p0com9.png')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {showFirstDiv ? (
            <div className="font-poppins ">
              <h1 className="text-3xl font-bold text-black text-center mb-4">
                {selectedEventDetails.name}
              </h1>
              <div className="flex flex-col items-center mb-4">
                <img
                  src={selectedEventDetails.image}
                  alt={selectedEventDetails.name}
                  className="w-1/2 h-auto rounded-lg mb-4"
                />
                <p className="text-lg font-medium text-black mb-2">
                  Start Date: {selectedEventDetails.start_date}
                </p>
                <p className="text-lg font-medium text-black mb-2">
                  End Date: {selectedEventDetails.end_date}
                </p>
                <Button
                  className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleToggleDiv}
                >
                  Click to see {showFirstDiv ? ">" : "<"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="font-poppins">
              <Tabs
                defaultActiveKey="1"
                centered
                items={[
                  {
                    key: "1",
                    label: "Event Sports",
                    children: (
                      <div className="flex flex-wrap justify-center mb-4 font-poppins">
                        {selectedEventDetails.event_sports?.map((sport) => (
                          <SportsCard
                            key={sport.id}
                            eventSportsId={sport.id}
                            name={sport.name}
                            image={sport.sports_image}
                            sports_id={sport.sports_id}
                            min_players={sport.min_players}
                            start_date={sport.start_date}
                            end_date={sport.end_date}
                            apply_due_date={sport.apply_due_date}
                            place={sport.place}
                            onEdit={() => handleEditSport(sport)}
                            event={events.find(
                              (event) => event.id === selectedEvent
                            )}
                            fetchEventDetails={fetchEventDetails}
                            role_id={role_id}
                          />
                        ))}
                        {role_id == 1 && (
                          <AddSportsCard
                            onClick={() => setIsSportModalVisible(true)}
                          />
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: "Participation List",
                    children: (
                      <>
                        {role_id == 1 ? (
                          <EventParticipantList />
                        ) : (
                          <ClubParticipants />
                        )}
                      </>
                    ),
                  },
                ]}
                tabBarStyle={{
                  fontFamily: "Poppins, sans-serif",
                  borderBottom: "none",
                }}
                className="customTab"
              />
              <Button
                className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleToggleDiv}
              >
                Click to go back {showFirstDiv ? ">" : "<"}
              </Button>
            </div>
          )}
        </div>
        {role_id == 1 && (
          <>
            <EventFormModal
              open={isEventModalVisible}
              onOk={handleEventModalOk}
              onCancel={handleEventModalCancel}
              event={
                isEditing
                  ? events.find((event) => event.id === selectedEvent)
                  : null
              }
            />

            <SportsFormModal
              visible={isSportModalVisible}
              onCancel={handleSportsModalCancel}
              event={events.find((event) => event.id === selectedEvent)}
              sport={selectedSport}
              onOk={handleSportsModalOk}
            />
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Events;
