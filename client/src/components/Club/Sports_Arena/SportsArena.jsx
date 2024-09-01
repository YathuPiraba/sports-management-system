import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { MdEditNote } from "react-icons/md";

const SportsArena = ({ sports, handleButtonClick, theme }) => {
  // Function to get unique arenas
  const getUniqueArenas = () => {
    const uniqueArenaIds = [
      ...new Set(sports.map((sport) => sport.sports_arena_id)),
    ];
    return uniqueArenaIds.map((arenaId) =>
      sports.find((sport) => sport.sports_arena_id === arenaId)
    );
  };

  // Function to get sports played in a given arena
  const getSportsForArena = (arenaId) => {
    return sports
      .filter((sport) => sport.sports_arena_id === arenaId)
      .map((sport) => sport.sportsName);
  };

  const uniqueArenas = getUniqueArenas();

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-200" : "bg-white"
      } shadow-lg rounded-lg w-full p-6`}
    >
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold flex-grow">Sports Arenas</h2>
        <button
          className="bg-gray-300 p-2 rounded-md hover:bg-gray-400"
          onClick={() => handleButtonClick("manageSportsArenas")}
        >
          <MdEditNote size={24} className="text-black" />
        </button>
      </div>

      {uniqueArenas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueArenas.map((arena) => (
            <div
              key={arena.sports_arena_id}
              className={`${
                theme === "light" ? "bg-white" : "bg-gray-200"
              } shadow-md rounded-lg overflow-hidden`}
            >
              {arena.sports_arena_image ? (
                <img
                  className="w-full h-40 object-cover"
                  src={arena.sports_arena_image}
                  alt={
                    arena.sports_arena_name
                      ? `${arena.sports_arena_name} Image`
                      : "Arena Image"
                  }
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  <img
                    className="w-full h-40 object-cover"
                    src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1725186027/istockphoto-464497970-612x612_lstzga.jpg"
                    alt="Arena Image"
                  />
                </div>
              )}
              <div className="flex items-center mt-2 px-2">
                <IoLocationSharp className="text-red-500 mr-1" />
                <p className="text-gray-600">
                  {arena.sports_arena_location || "No Location"}
                </p>
              </div>
              <div className="px-3 py-1">
                <h3 className="text-lg text-wrap font-semibold mb-1">
                  {arena.sports_arena_name || "No Name"}
                </h3>
                <p className="text-gray-500">
                  Address: {arena.sports_arena_address || "No Address"}
                </p>
                <div className="mt-2">
                  <h4 className="text-md font-semibold mb-1">Sports Played:</h4>
                  <ul className="list-disc ml-5 pb-1 text-gray-600">
                    {getSportsForArena(arena.sports_arena_id).length > 0 ? (
                      getSportsForArena(arena.sports_arena_id).map(
                        (sport, index) => <li key={index}>{sport}</li>
                      )
                    ) : (
                      <li>No Sports Available</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No arenas added yet.</p>
      )}
    </div>
  );
};

export default SportsArena;
