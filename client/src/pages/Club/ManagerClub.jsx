import React, { useEffect, useState, Suspense, lazy } from "react";
import { fetchClubDataAPI } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import GridLoader from "react-spinners/GridLoader";
import { useTheme } from "../../context/ThemeContext";
import { Tabs, Avatar, Button, Typography, Divider } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

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
        className={`container mx-auto p-8 ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        } text-${theme === "light" ? "black" : "white"} shadow-lg rounded-lg`}
      >
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8">
          <Avatar size={80} src={club.clubImage} />
          <div>
            <Title
              level={2}
              className={`m-0 ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              {club.clubName}
            </Title>
            <Text type="secondary">
              Joined {new Date(club.created_at).getFullYear()}
            </Text>
          </div>
          <div className="ml-auto space-x-4">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleButtonClick("editClub")}
              size="large"
            >
              Edit Club
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => handleButtonClick("addSports")}
              size="large"
            >
              Add Sports & Arenas
            </Button>
          </div>
        </div>

        <Divider />

        {/* Club Info */}
        <div className="mb-8">
          <Text strong className="mr-2">
            Contact:
          </Text>
          <Text>{club.clubContactNo}</Text>
          <br />
          <Text strong className="mr-2">
            History:
          </Text>
          <Text>{club.club_history}</Text>
        </div>

        {/* Sports and Arenas Sections */}
        <Tabs defaultActiveKey="1" items={tabItems} size="large" />
      </div>

      {renderComponent()}
    </Suspense>
  );
};

export default ManagerClub;
