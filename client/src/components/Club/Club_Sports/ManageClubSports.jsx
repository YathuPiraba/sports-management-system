import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Popconfirm } from "antd";
import {
  updateClubSportsAPI,
  deleteClubSportsAPI,
} from "../../../Services/apiServices";
import { MdClose } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

// Function to get unique sports from the list
const getUniqueSports = (sports) => {
  const uniqueSports = {};
  sports.forEach((sport) => {
    if (!uniqueSports[sport.sports_id]) {
      uniqueSports[sport.sports_id] = sport;
    }
  });
  return Object.values(uniqueSports);
};

// Function to get arenas by sport id
const getArenasBySportId = (sports, sportId) => {
  return sports
    .filter((sport) => sport.sports_id === sportId)
    .map((sport) => ({
      id: sport.sports_arena_id,
      name: sport.sports_arena_name,
    }));
};

const ManageClubSports = ({ sports, popClose, fetchClubData, theme }) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedArenas, setSelectedArenas] = useState([]);
  const [availableArenas, setAvailableArenas] = useState([]);

  // Get unique sports
  const uniqueSports = getUniqueSports(sports);

  // Handle sport selection change
  const handleSportChange = (e) => {
    const sportId = parseInt(e.target.value);
    const sport = sports.find((s) => s.sports_id === sportId);
    setSelectedSport(sport);
    if (sport) {
      const arenas = getArenasBySportId(sports, sportId);
      setAvailableArenas(arenas);
      setSelectedArenas(arenas.map((arena) => arena.id));
    } else {
      setAvailableArenas([]);
      setSelectedArenas([]);
    }
  };

  // Handle arena selection change
  const handleArenaChange = (arenaId) => {
    setSelectedArenas((prevArenas) =>
      prevArenas.includes(arenaId)
        ? prevArenas.filter((id) => id !== arenaId)
        : [...prevArenas, arenaId]
    );
  };

  // Handle form submission for updating club sports
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSport) {
      toast.error("Please select a sport");
      return;
    }

    const data = {
      sport_id: selectedSport.sports_id,
      sports_arena_ids: selectedArenas,
    };

    try {
      await updateClubSportsAPI(selectedSport.id, data);
      fetchClubData();
      toast.success("Club Sports updated successfully");
      popClose();
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
      await deleteClubSportsAPI(selectedSport.club_id, selectedSport.sports_id);
      fetchClubData();
      toast.success("Club Sports deleted successfully");
      popClose();
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.error || "Error in deleting Club Sports.";
      toast.error(errorMessage);
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
              {uniqueSports.map((sport) => (
                <option key={sport.sports_id} value={sport.sports_id}>
                  {sport.sportsName}
                </option>
              ))}
            </select>
          </div>

          {selectedSport && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Available Arenas:
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableArenas.map((arena) => (
                  <div
                    key={arena.id}
                    className={`px-3 py-1 rounded-full flex items-center space-x-2 cursor-pointer ${
                      selectedArenas.includes(arena.id)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => handleArenaChange(arena.id)}
                  >
                    <span>{arena.name}</span>
                    {selectedArenas.includes(arena.id) && (
                      <IoMdClose size={16} />
                    )}
                  </div>
                ))}
              </div>
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
