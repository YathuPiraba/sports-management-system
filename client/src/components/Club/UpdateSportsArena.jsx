import React, { useState } from "react";
import { updateSportsArenaAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";

const UpdateSportsArena = ({ sports }) => {
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
    formdata.append("image", image);
    formdata.append("location", location);
    formdata.append("name", arenaName);
    formdata.append("address", address);
    try {
      const res = updateSportsArenaAPI(arenaId, formdata);
      toast.success("SportsArena updated successfully");
    } catch (error) {
      toast.error("Error in updating sports arena");
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="bg-white">
      <h1>Update Sport Arena</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="arenaSelect"> Sports Arena Name:</label>
        <select id="arenaSelect" onChange={handleArenaChange}>
          <option value="">Select A Sport Arena</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.sports_arena_id}>
              {sport.sports_arena_name}
            </option>
          ))}
        </select>

        {selectedArena && (
          <>
            <label htmlFor="arenaName">Sports Arena Name:</label>
            <input
              type="text"
              id="arenaName"
              value={arenaName}
              onChange={(e) => setArenaName(e.target.value)}
            />

            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <label htmlFor="image">Arena Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
            />

            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button type="submit">Update Sport Arena</button>
          </>
        )}
      </form>
    </div>
  );
};

export default UpdateSportsArena;
