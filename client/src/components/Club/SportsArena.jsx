import React, { useState, useEffect } from "react";
import sample from "../../assets/sample.jpg";
import { IoLocationSharp } from "react-icons/io5";
import { MdEditNote } from "react-icons/md";

const SportsArena = ({ sports, popup }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg w-full p-6">
      <div className="flex w-full">
        <h2 className="text-xl font-semibold mb-4">Sports Arenas</h2>
        <button
          className="ml-auto mt-0 bg-gray-300 pl-2 pr-1 h-9"
          onClick={popup}
        >
          <MdEditNote size={30} className=" text-black pt-0" />
        </button>
      </div>
      {sports.length > 0 ? (
        [...new Set(sports.map((sport) => sport.sports_arena_id))].map(
          (arenaId, index) => {
            // Find the arena data based on arenaId
            const arena = sports.find(
              (sport) => sport.sports_arena_id === arenaId
            );
            return (
              <div key={index} className="mb-4">
                <div className="flex gap-1 mb-4">
                  {arena?.sports_arena_image && (
                    <img
                      className="h-24 w-24 object-cover rounded-md mr-4"
                      src={arena.sports_arena_image}
                      alt={`${arena.sports_arena_name} Image`}
                    />
                  )}
                  <div className="w-full">
                    <div className="flex w-full">
                      <h3 className="text-lg font-semibold">
                        {arena?.sports_arena_name}
                      </h3>
                      <div className=" flex mt-0.5 gap-3 ml-auto">
                        <IoLocationSharp className="text-red-500 mt-1" />
                        <p className="text-gray-500">
                          {arena?.sports_arena_location}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500">
                      Address: {arena?.sports_arena_address}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        )
      ) : (
        <p className="text-gray-500">No arenas added yet.</p>
      )}
    </div>
  );
};

export default SportsArena;
