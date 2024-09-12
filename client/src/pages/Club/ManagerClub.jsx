import React, { useEffect, useState, Suspense, lazy } from "react";
import { fetchClubDataAPI } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import GridLoader from "react-spinners/GridLoader";
import { useTheme } from "../../context/ThemeContext";
import { Tabs, Avatar, Button, Typography, Divider } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { MdVerified, MdPhone, MdLocationOn } from "react-icons/md";
const { Title, Text } = Typography;

import SportsArena from "../../Components/Club/Sports_Arena/SportsArena";

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

const ManagerClub = () => {
  const [club, setClub] = useState(null);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);
  const { theme } = useTheme();
  const role_id = useSelector((state) => state.auth.userdata.role_id);

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
          role_id={role_id}
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
          role_id={role_id}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[75vh]">
        <GridLoader
          loading={loading}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#4682B4"
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={` mx-auto sm:mr-2 sm:ml-6 md:ml-5 lg:ml-5 p-4 sm:p-6 md:p-8 ${
          theme === "light" ? "bg-white" : "bg-gray-300"
        } shadow-lg rounded-lg`}
      >
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center mb-8">
          <Avatar size={80} src={club.clubImage} />
          <div className="text-center sm:text-left sm:ml-6">
            <div className="flex  justify-center sm:justify-start">
              <Title
                level={2}
                className={`m-0 ${
                  theme === "light" ? "text-gray-800" : "text-white"
                } items-center`}
              >
                {club.clubName}
              </Title>
              <MdVerified className="ml-3 text-blue-500 mt-2" />
            </div>
            <Text type="secondary">
              Joined {new Date(club.created_at).getFullYear()}
            </Text>
          </div>
          {role_id == 2 && (
            <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-wrap justify-center sm:justify-end space-x-2">
              <Button
                icon={<EditOutlined />}
                onClick={() => handleButtonClick("editClub")}
                size="medium"
              >
                Edit Club
              </Button>
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleButtonClick("addSports")}
                size="medium"
              >
                Add Sports & Arenas
              </Button>
            </div>
          )}
        </div>

        <Divider />

        {/* Club Info */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-2/5 pr-4 mb-4 sm:mb-0">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <MdPhone className="mr-2 text-blue-500" />
                  <Text>{club.clubContactNo}</Text>
                </div>
                <div className="flex items-center mt-2 sm:mt-0 sm:ml-8">
                  <Text strong className="mr-2">
                    G.N Division:
                  </Text>
                  <Text>{club.clubDivisionName}</Text>
                </div>
              </div>
              <div className="flex items-center">
                <MdLocationOn className="mr-2 text-red-500" />
                <Text>{club.clubAddress}</Text>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-3/5 pl-0 sm:pl-4">
            <div className="mb-8">
              <Text strong className="mr-2">
                History:
              </Text>
              <Text className="break-words">{club.club_history}</Text>
            </div>
          </div>
        </div>

        {/* Sports and Arenas Sections */}
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </div>

      {renderComponent()}
    </Suspense>
  );
};

export default ManagerClub;
