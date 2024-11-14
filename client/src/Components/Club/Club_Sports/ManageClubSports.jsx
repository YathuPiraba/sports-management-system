import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button, Popconfirm } from "antd";
import {
  updateClubSportsAPI,
  deleteClubSportsAPI,
} from "../../../Services/apiServices";
import { MdClose } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

// Helper function to get unique sports
const getUniqueSports = (sports) => {
  const sportsMap = new Map();
  sports.forEach((sport) => sportsMap.set(sport.sports_id, sport));
  return Array.from(sportsMap.values());
};

// Helper function to get arenas by sport ID
const getArenasBySportId = (sports, sportId) =>
  sports
    .filter((sport) => sport.sports_id === sportId)
    .map((sport) => ({
      id: sport.sports_arena_id,
      name: sport.sports_arena_name,
    }));

const ManageClubSports = ({ sports, popClose, fetchClubData, theme }) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedArenas, setSelectedArenas] = useState([]);
  const [availableArenas, setAvailableArenas] = useState([]);
  const [loading, setLoading] = useState(false);

  const uniqueSports = getUniqueSports(sports);

  useEffect(() => {
    const uniqueArenas = Array.from(
      new Map(
        sports.map(({ sports_arena_id, sports_arena_name }) => [
          sports_arena_id,
          { id: sports_arena_id, name: sports_arena_name },
        ])
      ).values()
    );

    setAvailableArenas(uniqueArenas);
  }, [sports]);

  const handleSportChange = (e) => {
    const sportId = Number(e.target.value);
    const selected = sports.find((s) => s.sports_id === sportId);
    setSelectedSport(selected);

    if (selected) {
      setSelectedArenas(
        getArenasBySportId(sports, sportId).map((arena) => arena.id)
      );
    } else {
      setSelectedArenas([]);
    }
  };

  const handleArenaChange = (arenaId) => {
    setSelectedArenas((prevArenas) =>
      prevArenas.includes(arenaId)
        ? prevArenas.filter((id) => id !== arenaId)
        : [...prevArenas, arenaId]
    );
  };

  const handleSelectArenaChange = (e) => {
    const arenaId = Number(e.target.value);
    if (arenaId && !selectedArenas.includes(arenaId)) {
      setSelectedArenas((prevArenas) => [...prevArenas, arenaId]);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSport) return toast.error("Please select a sport");

    const data = {
      sport_id: selectedSport.sports_id,
      sports_arena_ids: selectedArenas,
    };
    setLoading(true);
    try {
      await updateClubSportsAPI(selectedSport.club_id, data);
      fetchClubData();
      toast.success("Club Sports updated successfully");
      popClose();
    } catch (error) {
      console.error(error);
      toast.error("Error in updating Club Sports");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSport) return toast.error("Please select a sport");

    try {
      await deleteClubSportsAPI(selectedSport.club_id, selectedSport.sports_id);
      fetchClubData();
      toast.success("Club Sports deleted successfully");
      popClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error in deleting Club Sports.";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : "bg-white"
      } p-6 w-1/2 z-50 border absolute text-black top-44 left-64 sm:right-28 sm:top-64  rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Manage Club Sports</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
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
            {uniqueSports.map(({ sports_id, sportsName }) => (
              <option key={sports_id} value={sports_id}>
                {sportsName}
              </option>
            ))}
          </select>
        </div>

        {selectedSport && (
          <div>
            <div className="my-2">
              <label
                htmlFor="arenaSelect"
                className="block text-sm font-medium text-gray-700"
              >
                Select Sports Arenas:
              </label>
              <select
                id="arenaSelect"
                value=""
                onChange={handleSelectArenaChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select an Arena</option>
                {availableArenas.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Playing Arenas:
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableArenas.filter((arena) =>
                selectedArenas.includes(arena.id)
              ).length > 0 ? (
                availableArenas
                  .filter((arena) => selectedArenas.includes(arena.id))
                  .map(({ id, name }) => (
                    <div
                      key={id}
                      className={`px-3 py-1 rounded-full flex items-center space-x-2 cursor-pointer ${
                        selectedArenas.includes(id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleArenaChange(id)}
                    >
                      <span>{name}</span>
                      {selectedArenas.includes(id) && <IoMdClose size={16} />}
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">
                  Currently no sport arenas for {selectedSport.sportsName}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-4 mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500 text-white px-4 py-5 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Club Sports
          </Button>

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
  );
};

export default ManageClubSports;
