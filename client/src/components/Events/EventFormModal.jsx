import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "antd";
import { addEventAPI, editEventAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";

const EventFormModal = ({
  open,
  onOk,
  onCancel,
  event,
  fetchEvents,
  fetchEventDetails,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    image: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (event) {
        // If there's an event, we are in "Edit" mode
        setFormData({
          name: event.name || "",
          start_date: event.start_date || "",
          end_date: event.end_date || "",
          image: null,
        });
      } else {
        // If there's no event, we are in "Add" mode
        setFormData({
          name: "",
          start_date: "",
          end_date: "",
          image: null,
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  }, [open, event]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("end_date", formData.end_date);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (event) {
        // Edit event
        await editEventAPI(event.id, formDataToSend);
        toast.success("Event updated successfully!");
      } else {
        // Add new event
        await addEventAPI(formDataToSend);
        toast.success("Event created successfully!");
      }
      fetchEvents();
      fetchEventDetails();

      onOk();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save event.";
      toast.error(errorMessage);
    }
  };

  return (
    <Modal
      title={event ? "Edit Event" : "Add Event"}
      open={open}
      footer={null}
      onCancel={onCancel}
      className="text-center"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-1 mt-2 text-left"
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="font-semibold text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="start_date" className="font-semibold text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="end_date" className="font-semibold text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="image" className="font-semibold text-gray-700">
            Event Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600"
          >
            {event ? "Update Event" : "Create Event"}
          </Button>
          <Button
            type="default"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
