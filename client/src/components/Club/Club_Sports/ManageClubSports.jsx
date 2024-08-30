import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Popconfirm } from "antd";
import {
  updateClubSportsAPI,
  deleteClubSportsAPI,
} from "../../../Services/apiServices";
import { MdClose } from "react-icons/md";

const ManageClubSports = ({ sports, popClose, fetchClubData, theme }) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedArena, setSelectedArena] = useState("");

  // Handle sport selection change
  const handleSportChange = (e) => {
    const sportId = e.target.value;
    const sport = sports.find((s) => s.sports_id === parseInt(sportId));
    setSelectedSport(sport);
    setSelectedArena(sport ? sport.sports_arena_id : "");
  };

  // Handle arena selection change
  const handleArenaChange = (e) => {
    setSelectedArena(e.target.value);
  };

  // Handle form submission for updating club sports
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSport || !selectedArena) {
      toast.error("Please select a sport and an arena");
      return;
    }

    const data = {
      sport_id: selectedSport.sports_id,
      sports_arena_id: selectedArena,
    };

    try {
      await updateClubSportsAPI(selectedSport.id, data);
      fetchClubData(); // Update the state with the latest data
      toast.success("Club Sports updated successfully");
      popClose(); // Close the modal or perform any other UI action
    } catch (error) {
      console.log(error);
      toast.error("Error in updating Club Sports");
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    if (!selectedSport) {
      toast.error("Please select a sport");
      return;
    }

    try {
      await deleteClubSportsAPI(selectedSport.id);
      fetchClubData();
      toast.success("Club Sports deleted successfully");
      popClose();
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting Club Sports");
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : "bg-white"
      } p-6 w-1/2 z-50 border absolute text-black top-44 left-64 rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Manage Club Sports</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <div className="mt-4">
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="sportSelect"
              className="block text-sm font-medium text-gray-700"
            >
              Select Sport:
            </label>
            <select
              id="sportSelect"
              value={selectedSport ? selectedSport.sports_id : ""}
              onChange={handleSportChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a Sport</option>
              {sports.map((sport) => (
                <option key={sport.sports_id} value={sport.sports_id}>
                  {sport.sportsName}
                </option>
              ))}
            </select>
          </div>

          {selectedSport && (
            <div>
              <label
                htmlFor="arenaSelect"
                className="block text-sm font-medium text-gray-700"
              >
                Select Arena:
              </label>
              <select
                id="arenaSelect"
                value={selectedArena}
                onChange={handleArenaChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select an Arena</option>
                {sports.map((sport) => (
                  <option
                    key={sport.sports_arena_id}
                    value={sport.sports_arena_id}
                  >
                    {sport.sports_arena_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Club Sports
            </button>

            <Popconfirm
              title="Are you sure you want to delete this club sports entry?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </Popconfirm>

            <button
              type="button"
              onClick={popClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageClubSports;
