import React from "react";

const ClubSports = ({ sports }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Club Sports</h2>
      {sports.length > 0 ? (
        sports.map((sport) => (
          <div key={sport.id} className="mb-4">
            <h3 className="text-lg font-semibold">{sport.sportsName}</h3>
            <p className="text-gray-500">Arena: {sport.sports_arena_name}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No sports added yet.</p>
      )}
    </div>
  );
};

export default ClubSports;
