import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import toast from "react-hot-toast"; // Import toast from react-hot-toast
import {
  addEventSportsAPI,
  getAllSportsAPI,
} from "../../../Services/apiServices";

const SportsFormModal = ({
  visible,
  onOk,
  onCancel,
  sport,
  fetchEventDetails,
  event,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    apply_due_date: "",
    place: "",
    sports_id: "",
  });

  useEffect(() => {
    if(visible){
    if (sport) {
      setFormData({
        name: sport.name || "",
        start_date: sport.start_date || "",
        end_date: sport.end_date || "",
        apply_due_date: sport.apply_due_date || "",
        place: sport.place || "",
        sports_id: sport.sports_id || "",
      });
    } else {
      // Reset the form data when there's no sport
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        apply_due_date: "",
        place: "",
        sports_id: "",
      });
    }
  }

  }, [sport, visible]);

  const [loading, setLoading] = useState(false);
  const [sportsList, setSportsList] = useState([]);

  const fetchSports = async () => {
    try {
      const response = await getAllSportsAPI();
      console.log(response.data);
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
      const response = await addEventSportsAPI(event.id, formData);

      if (response && response.success) {
        toast.success("Event updated successfully!");
      } else {
        toast.success("Event sports added successfully!");
      }

      fetchEventDetails();
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

  return (
    <Modal
      title={sport ? "Edit Sport" : "Add Sport"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleModalCancel} // Use the updated onCancel handler
      confirmLoading={loading}
      className="text-center"
    >
      <form className="mt-0 text-left">
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