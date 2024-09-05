import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { addEventAPI, editEventAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";

const EventFormModal = ({ open, onOk, onCancel, event, fetchEvents }) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        start_date: event.start_date || "",
        end_date: event.end_date || "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedValues = {
        ...formData,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };
      if (event) {
        // Edit event
        await editEventAPI(event.id, formattedValues);
      } else {
        // Add new event
        await addEventAPI(formattedValues);
      }
      fetchEvents();
      toast.success("Event saved successfully!");
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
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="default"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
