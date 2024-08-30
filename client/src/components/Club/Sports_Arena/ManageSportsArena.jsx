import React, { useState } from "react";
import {
  deleteSportsArenaAPI,
  getSportsBySportsArenaAPI,
} from "../../../Services/apiServices";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { Tabs } from "antd";
import UpdateSportsArena from "./UpdateSportsArena";

const ManageSportsArena = ({
  sports,
  popClose,
  fetchClubData,
  theme,
  club,
}) => {
  const [selectedArena, setSelectedArena] = useState(null);
  const [location, setLocation] = useState("");
  const [arenaName, setArenaName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [sportsData, setSportsData] = useState([]);

  const handleArenaChange = async (e) => {
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

      try {
        const response = await getSportsBySportsArenaAPI(club.id, arenaId);
        setSportsData(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching sports data");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedArena) {
      toast.error("Please select a sports arena");
      return;
    }

    try {
      await deleteSportsArenaAPI(
        selectedArena.club_id,
        selectedArena.sports_arena_id
      );
      fetchClubData();
      toast.success("Sports Arena deleted successfully");
      popClose();
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting sports arena");
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "Update",
      children: selectedArena && (
        <UpdateSportsArena
          selectedArena={selectedArena}
          arenaName={arenaName}
          setArenaName={setArenaName}
          location={location}
          setLocation={setLocation}
          address={address}
          setAddress={setAddress}
          image={image}
          setImage={setImage}
          fetchClubData={fetchClubData}
          popClose={popClose}
        />
      ),
    },
    {
      key: "2",
      label: "Delete",
      children: selectedArena && (
        <div>
          <p className="text-center">
            Are you sure you want to delete this sports arena?
          </p>
          <div className="flex justify-center gap-5 space-x-4 mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
            <button
              onClick={popClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : "bg-white"
      } p-6 w-1/2 z-50 border absolute text-black top-44 left-64 rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Manage Sports Arena</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <div className="mt-4">
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
        {selectedArena && (
          <div className="my-2">
            {sportsData.length > 0 ? (
              <div>
                <p className="text-lg font-semibold">
                  Sports played by your club here:
                </p>
                <ul className="list-disc flex flex-col items-center mt-2 space-y-1">
                  {sportsData.map((item) => (
                    <li key={item.sports.id} className="hover:text-blue-600">
                      {item.sports.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No sports played in this arena.</p>
            )}
          </div>
        )}
        <Tabs defaultActiveKey="1" centered className="mt-4" items={tabItems} />
      </div>
    </div>
  );
};

export default ManageSportsArena;
