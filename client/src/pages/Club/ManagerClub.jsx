import React, { useEffect, useState, Suspense, lazy } from "react";
import { fetchClubDataAPI } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import GridLoader from "react-spinners/GridLoader";
import { useTheme } from "../../context/ThemeContext";

const SportsArena = lazy(() =>
  import("../../Components/Club/Sports_Arena/SportsArena")
);
const ClubSports = lazy(() =>
  import("../../Components/Club/Club_Sports/ClubSports")
);
const ManageSportsArena = lazy(() =>
  import("../../Components/Club/Sports_Arena/ManageSportsArena")
);
const ManageClubSports = lazy(() =>
  import("../../Components/Club/Club_Sports/ManageClubSports")
);
const UpdateClub = lazy(() => import("../../Components/Club/UpdateClub"));
const AddClubSports = lazy(() => import("../../Components/Club/AddClubSports"));
import { Tabs } from "antd";

const ManagerClub = () => {
  const [club, setClub] = useState(null);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  const { theme } = useTheme();

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

  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "editClub":
        return (
          <UpdateClub
            club={club}
            fetchClubData={fetchClubData}
            popClose={() => setActiveComponent(null)}
            theme={theme}
          />
        );
      case "addSports":
        return (
          <AddClubSports
            fetchClubData={fetchClubData}
            popClose={() => setActiveComponent(null)}
            theme={theme}
            sportsDetails={sports}
            club={club}
          />
        );
      case "manageSportsArenas":
        return (
          <ManageSportsArena
            sports={sports}
            popClose={() => setActiveComponent(null)}
            fetchClubData={fetchClubData}
            theme={theme}
            club={club}
          />
        );
      case "manageClubSports":
        return (
          <ManageClubSports
            sports={sports}
            popClose={() => setActiveComponent(null)}
            fetchClubData={fetchClubData}
            theme={theme}
          />
        );
      default:
        return null;
    }
  };

  const tabItems = [
    {
      key: "1",
      label: "Club Sports",
      children: (
        <ClubSports
          sports={sports}
          theme={theme}
          handleButtonClick={handleButtonClick}
        />
      ),
    },
    {
      key: "2",
      label: "Sports Arena",
      children: (
        <SportsArena
          sports={sports}
          handleButtonClick={handleButtonClick}
          theme={theme}
        />
      ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative">
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
            <div
              className={` ${
                theme === "light" ? "bg-white" : "bg-gray-100"
              } shadow-lg rounded-lg overflow-hidden`}
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0 pt-7 pl-4">
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
                    Joined Year:{" "}
                    {new Date(club?.created_at).getFullYear() || "N/A"}
                  </p>
                  <p className="mt-4 text-gray-700">
                    {club?.club_history ||
                      "Club history and description goes here. This is a brief overview of the club's background and achievements."}
                  </p>

                  <div className="mt-6 flex space-x-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleButtonClick("editClub")}
                    >
                      Edit Club
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleButtonClick("addSports")}
                    >
                      Add Sports & Arenas
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sports and Arenas Sections */}
            <Tabs defaultActiveKey="1" centered items={tabItems} />
          </div>
        )}
        {renderComponent()}
      </div>
    </Suspense>
  );
};

export default ManagerClub;
