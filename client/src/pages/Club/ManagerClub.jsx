import React, { useEffect, useState, Suspense, lazy } from "react";
import { fetchClubDataAPI } from "../../Services/apiServices";
import { useSelector } from "react-redux";
const SportsArena = lazy(() => import("../../Components/Club/SportsArena"));
const ClubSports = lazy(() => import("../../Components/Club/ClubSports"));
import GridLoader from "react-spinners/GridLoader";
import { createSportsArenaAPI } from "../../Services/apiServices";

const ManagerClub = () => {
  const [club, setClub] = useState(null);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state) => state.auth.userdata.userId);

  const fetchClubData = async () => {
    try {
      const response = await fetchClubDataAPI(userId);
      const data = response.data;
      setClub(data.club);
      setSports(data.sports);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        {loading ? (
          <div className="flex justify-center items-center w-full h-[75vh]">
            <GridLoader
              loading={loading}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
              color="#4682B4"
            />
          </div>
        ) : (
          <div className="container mx-auto p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={club.clubImage}
                    alt="Club Image"
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    {club?.clubName || "Club Name"}
                  </div>
                  <p className="mt-2 text-gray-500">
                    Contact: {club?.clubContactNo || "N/A"}
                  </p>
                  <p className="mt-2 text-gray-500">
                    Established:{" "}
                    {new Date(club?.created_at).getFullYear() || "N/A"}
                  </p>
                  <p className="mt-4 text-gray-700">
                    {club?.club_history ||
                      "Club history and description goes here. This is a brief overview of the club's background and achievements."}
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
              <ClubSports sports={sports} />
              <SportsArena sports={sports} />
            </div>
          </div>
        )}
      </>
    </Suspense>
  );
};

export default ManagerClub;
