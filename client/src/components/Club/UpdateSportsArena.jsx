import React, { useState } from "react";
import { updateSportsArenaAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

const UpdateSportsArena = ({ sports, popClose, fetchClubData, theme }) => {
  const [selectedArena, setSelectedArena] = useState(null);
  const [location, setLocation] = useState("");
  const [arenaName, setArenaName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  const handleArenaChange = (e) => {
    const arenaId = e.target.value;
    const selected = sports.find(
      (sport) => sport.sports_arena_id === parseInt(arenaId)
    );
    setSelectedArena(selected);
    if (selected) {
      setArenaName(selected.sports_arena_name);
      setLocation(selected.sports_arena_location);
      setAddress(selected.sports_arena_address);
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArena) {
      toast.error("Please select a sports arena");
      return;
    }

    const formdata = new FormData();
    if (image) {
      formdata.append("image", image);
    }
    formdata.append("location", location);
    formdata.append("name", arenaName);
    formdata.append("address", address);
    try {
      await updateSportsArenaAPI(selectedArena.sports_arena_id, formdata);
      fetchClubData();
      toast.success("SportsArena updated successfully");
      popClose();
    } catch (error) {
      console.log(error);
      toast.error("Error in updating sports arena");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : " bg-white"
      } p-6 w-1/2 z-50 border absolute text-black top-44 left-64 rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Update Sport Arena</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="arenaSelect"
            className="block text-sm font-medium text-gray-700"
          >
            Sports Arena Name:
          </label>
          <select
            id="arenaSelect"
            onChange={handleArenaChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select A Sport Arena</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.sports_arena_id}>
                {sport.sports_arena_name}
              </option>
            ))}
          </select>
        </div>

        {selectedArena && (
          <>
            <div>
              <label
                htmlFor="arenaName"
                className="block text-sm font-medium text-gray-700"
              >
                Sports Arena Name:
              </label>
              <input
                type="text"
                id="arenaName"
                value={arenaName}
                onChange={(e) => setArenaName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location:
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Arena Image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <textarea
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Sport Arena
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default UpdateSportsArena;
