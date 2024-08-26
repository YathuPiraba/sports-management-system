import React, { useEffect, useState } from "react";
import { fetchClubData } from "../../Services/apiServices";

const ManagerClub = () => {
  const [club, setClub] = useState(null);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace 'userId' with the actual user ID you want to pass
    const userId = 1; // or get it from a context or prop
    const fetchData = async () => {
      try {
        const response = await fetchClubData(userId);
        if (response.ok) {
          const data = await response.json();
          setClub(data.club);
          setSports(data.sports);
        } else {
          throw new Error('Failed to fetch club data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={club?.clubImage ? `/path-to-images/${club.clubImage}` : "/path-to-default-image.jpg"}
              alt="Club Image"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {club?.clubName || "Club Name"}
            </div>
            <p className="mt-2 text-gray-500">Contact: {club?.clubContactNo || "N/A"}</p>
            <p className="mt-2 text-gray-500">Established: {new Date(club?.created_at).getFullYear() || "N/A"}</p>
            <p className="mt-4 text-gray-700">
              {club?.club_history || "Club history and description goes here. This is a brief overview of the club's background and achievements."}
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

      {/* Sports and Arenas Sections */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sports Arenas</h2>
          {/* You can modify this section to show sports arenas if you have additional data */}
          {sports.length > 0 ? (
            [...new Set(sports.map(sport => sport.sports_arena_name))].map((arena, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold">{arena}</h3>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No arenas added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerClub;
