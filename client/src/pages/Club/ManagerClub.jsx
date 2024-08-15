import React from "react";

const ManagerClub = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src="/path-to-club-image.jpg"
              alt="Club Image"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Club Name
            </div>
            <p className="mt-2 text-gray-500">Contact: +1 234 567 8900</p>
            <p className="mt-2 text-gray-500">Established: 2000</p>
            <p className="mt-4 text-gray-700">
              Club history and description goes here. This is a brief overview
              of the club's background and achievements.
            </p>

            <div className="mt-6 flex space-x-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Sports
              </button>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Add Sports Arenas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for Sports and Arenas sections */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Club Sports</h2>
          {/* Add content for sports here */}
          <p className="text-gray-500">No sports added yet.</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sports Arenas</h2>
          {/* Add content for sports arenas here */}
          <p className="text-gray-500">No arenas added yet.</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerClub;
