import React from "react";
import { MdEditNote } from "react-icons/md";

const ClubSports = ({ sports, theme, handleButtonClick }) => {
  // Function to get unique sports
  const getUniqueSports = () => {
    const uniqueSportIds = [...new Set(sports.map((sport) => sport.sports_id))];
    return uniqueSportIds.map((sportId) =>
      sports.find((sport) => sport.sports_id === sportId)
    );
  };

  // Function to get arenas for a given sport
  const getArenasForSport = (sportId) => {
    return sports
      .filter((sport) => sport.sports_id === sportId)
      .map((sport) => sport.sports_arena_name);
  };

  const uniqueSports = getUniqueSports();

  return (
    <div
      className={`${
        theme === "light" ? "bg-white" : "bg-gray-100"
      } shadow-lg rounded-lg p-6`}
    >
      <div className="flex w-full items-center mb-4">
        <h2 className="text-xl font-semibold flex-grow">Club Sports</h2>
        <button
          className="ml-auto bg-gray-300 p-2 rounded-md hover:bg-gray-400"
          onClick={() => handleButtonClick("manageClubSports")}
        >
          <MdEditNote size={24} className="text-black" />
        </button>
      </div>

      {uniqueSports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueSports.map((sport) => (
            <div
              key={sport.id}
              className="bg-white shadow-md rounded-lg overflow-hidden relative hover:shadow-lg transition-shadow duration-300"
            >
              {sport.sportsImage ? (
                <img
                  className="w-full h-32 object-cover"
                  src={sport.sportsImage}
                  alt={sport.sportsName}
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {sport.sportsName}
                </h3>
                <p className="text-gray-600">Arenas:</p>
                <ul className="list-disc ml-5 text-gray-600">
                  {getArenasForSport(sport.sports_id).map((arena, index) => (
                    <li key={index}>{arena}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No sports added yet.</p>
      )}
    </div>
  );
};

export default ClubSports;
