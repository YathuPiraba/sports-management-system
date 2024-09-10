import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import toast from "react-hot-toast";
import {
  addEventSportsAPI,
  getAllSportsAPI,
  editEventSportsAPI,
} from "../../../Services/apiServices";
import { FadeLoader } from "react-spinners";

const SportsFormModal = ({ visible, onCancel, sport, event, onOk }) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    apply_due_date: "",
    place: "",
    sports_id: "",
  });

  useEffect(() => {
    if (visible) {
      if (sport) {
        setFormData({
          name: sport.name || "",
          start_date: sport.start_date || event?.start_date || "",
          end_date: sport.end_date || "",
          apply_due_date: sport.apply_due_date || "",
          place: sport.place || "",
          sports_id: sport.sports_id || "",
        });
      } else {
        // Reset the form data when there's no sport
        setFormData({
          name: "",
          start_date: event?.start_date || "",
          end_date: "",
          apply_due_date: "",
          place: "",
          sports_id: "",
        });
      }
    }
  }, [sport, visible, event]);

  const [loading, setLoading] = useState(false);
  const [sportsList, setSportsList] = useState([]);

  const fetchSports = async () => {
    try {
      const response = await getAllSportsAPI();
      setSportsList(response.data);
    } catch (error) {
      console.error("Error fetching sports names:", error);
      toast.error("Failed to fetch sports names.");
    }
  };

  // Fetch sports names when the modal opens
  useEffect(() => {
    fetchSports();
  }, [visible]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.apply_due_date ||
      !formData.place ||
      !formData.sports_id
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (sport) {
        await editEventSportsAPI(event.id, sport.id, formData);
        toast.success("Event updated successfully!");
      } else {
        await addEventSportsAPI(event.id, formData);
        toast.success("Event sports added successfully!");
      }

      onOk();
    } catch (error) {
      console.error("Error while adding or updating the sport:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save event.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      apply_due_date: "",
      place: "",
      sports_id: "",
    });
    onCancel();
  };

  function getMaxDate(startDate) {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  return (
    <Modal
      title={sport ? "Edit Sport" : "Add Sport"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleModalCancel}
      confirmLoading={loading}
      className="text-center"
      maskClosable={false}
    >
      <form className="mt-0 text-left">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm z-50">
            <FadeLoader className="ml-1 mt-1" color="skyblue" />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium">
            Event Sport Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sportId" className="block font-medium">
            Sport
          </label>
          <select
            id="sportId"
            name="sports_id"
            value={formData.sports_id}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
            required
          >
            <option value="">Select a sport</option>
            {sportsList.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="start_date" className="block font-medium">
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            min={event?.start_date}
            max={event?.end_date}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="end_date" className="block font-medium">
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            min={formData.start_date}
            max={event?.end_date}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="apply_due_date" className="block font-medium">
            Apply Due Date
          </label>
          <input
            type="date"
            id="apply_due_date"
            name="apply_due_date"
            value={formData.apply_due_date}
            onChange={handleInputChange}
            max={getMaxDate(formData.start_date)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="place" className="block font-medium">
            Venue
          </label>
          <input
            type="text"
            id="place"
            name="place"
            value={formData.place}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default SportsFormModal;
