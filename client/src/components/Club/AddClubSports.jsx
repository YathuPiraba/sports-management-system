import React, { useState, useEffect } from "react";
import {
  getAllSportsAPI,
  getAllSportArenasAPI,
  createClubSportsAPI,
} from "../../Services/apiServices";
import { toast } from "react-hot-toast";
import { MdClose } from "react-icons/md";

const AddClubSports = ({
  popClose,
  fetchClubData,
  theme,
  club,
  sportsDetails,
}) => {
  const [sports, setSports] = useState([]);
  const [arenas, setArenas] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedArena, setSelectedArena] = useState("");
  const [isAddingNewSport, setIsAddingNewSport] = useState(false);
  const [selectedArenaClubs, setSelectedArenaClubs] = useState([]);
  const [newSport, setNewSport] = useState({
    name: "",
    type: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportsResponse = await getAllSportsAPI();
        const arenasResponse = await getAllSportArenasAPI();

        const filteredSports = sportsResponse.data.filter(
          (sport) =>
            !sportsDetails.some((detail) => detail.sports_id == sport.id)
        );

        setSports(filteredSports);
        setArenas(arenasResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching sports or arenas data");
      }
    };

    fetchData();
  }, [sportsDetails]);

  const handleSportChange = (e) => {
    const value = e.target.value;
    setSelectedSport(value);
    setIsAddingNewSport(value === "new");
    if (value !== "new") {
      setNewSport({
        name: "",
        type: "",
        description: "",
        image: null,
      });
    }
  };

  const handleNewSportChange = (e) => {
    const { name, value, files } = e.target;
    setNewSport((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleArenaChange = (e) => {
    const arenaName = e.target.value;
    setSelectedArena(arenaName);
    const selectedArenaData = arenas.find((arena) => arena.name === arenaName);
    setSelectedArenaClubs(selectedArenaData?.clubs || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("clubName", club.clubName);
    formData.append("sportsArenaName", selectedArena);

    if (isAddingNewSport) {
      formData.append("newSport", JSON.stringify(newSport));
      if (newSport.image) {
        formData.append("sportImage", newSport.image);
      }
    } else {
      formData.append("sportsName", selectedSport);
    }

    try {
      await createClubSportsAPI(formData);
      fetchClubData();
      toast.success("Club Sport added successfully");
      popClose();
    } catch (error) {
      console.error("Error adding club sport:", error);
      toast.error("Error in adding club sport");
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : "bg-white"
      } p-6 w-1/2 z-50 border absolute text-black top-44 left-64 rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Add Club Sports</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Sports Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Sport:
          </label>
          <select
            value={selectedSport}
            onChange={handleSportChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select A Sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
            <option value="new">Add New Sport</option>
          </select>
        </div>

        {/* New Sport Fields */}
        {isAddingNewSport && (
          <div className="space-y-2">
            <div>
              <label
                htmlFor="sportName"
                className="block text-sm font-medium text-gray-700"
              >
                Sport Name:
              </label>
              <input
                id="sportName"
                type="text"
                name="name"
                value={newSport.name}
                onChange={handleNewSportChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sportType"
                className="block text-sm font-medium text-gray-700"
              >
                Sport Type:
              </label>
              <select
                id="sportType"
                name="type"
                value={newSport.type}
                onChange={handleNewSportChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select sport type
                </option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sportDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Sport Description:
              </label>
              <textarea
                id="sportDescription"
                name="description"
                value={newSport.description}
                onChange={handleNewSportChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sportImage"
                className="block text-sm font-medium text-gray-700"
              >
                Sport Image:
              </label>
              <input
                id="sportImage"
                type="file"
                name="image"
                onChange={handleNewSportChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Arena Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Sports Arena:
          </label>
          <select
            value={selectedArena}
            onChange={handleArenaChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select A Sports Arena</option>
            {arenas.map((arena) => (
              <option key={arena.id} value={arena.name}>
                {arena.name}
              </option>
            ))}
          </select>
          {selectedArenaClubs.length > 0 && (
            <div className="mt-2 text-sm text-gray-700">
              <strong>Clubs Playing: </strong>
              {selectedArenaClubs.map((club) => club.clubName).join(", ")}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Club Sport
        </button>
      </form>
    </div>
  );
};

export default AddClubSports;
