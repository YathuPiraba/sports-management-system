import React, { useEffect, useState } from "react";
import { getAllSportsAPI, deleteSportsAPI } from "../../Services/apiServices";
import {
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import AddSports from "./AddSports";
import { GridLoader } from "react-spinners";

const DisplaySports = ({ theme }) => {
  const [sports, setSports] = useState([]);
  const [openSportsModal, setOpenSportsModel] = useState(false);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null); // New state for selected sport

  const handleSportsModal = (sport = null) => {
    setSelectedSport(sport); // Set the selected sport (if editing)
    setOpenSportsModel(true);
  };

  const closeSportsModal = () => {
    setSelectedSport(null); // Reset selected sport when closing modal
    setOpenSportsModel(false);
  };

  const fetchSports = async () => {
    setSportsLoading(true);
    try {
      const res = await getAllSportsAPI();
      setSports(res.data);
    } catch (error) {
      console.log("Error fetching sports data:", error);
    } finally {
      setSportsLoading(false);
    }
  };

  const handleDelete = async (sportId) => {
    try {
      await deleteSportsAPI(sportId);
      fetchSports(); // Refetch sports after deletion
    } catch (error) {
      console.log("Error deleting sports category:", error);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  if (sportsLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[75vh]">
        <GridLoader
          loading={sportsLoading}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#4682B4"
        />
      </div>
    );
  }

  return (
    <>
      <div>
        <button
          className={`bg-blue-500 text-white rounded-md px-4 py-2 text-lg flex items-center hover:bg-blue-600`}
          onClick={() => handleSportsModal()}
        >
          <PlusOutlined className="mr-2" /> Add Sport
        </button>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sports.map((sport) => (
          <div
            key={sport.id}
            className={` ${
              theme === "light" ? "bg-white" : "bg-gray-200 text-black"
            }  rounded-lg shadow-md p-4 flex flex-col items-start`}
          >
            <img
              src={sport.image}
              alt={sport.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{sport.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{sport.description}</p>

            <div className="flex items-center mb-4">
              <InfoCircleOutlined className="text-gray-600 mr-2" />
              <span className="text-sm">
                {sport.type.charAt(0).toUpperCase() + sport.type.slice(1)} Sport
              </span>
            </div>

            <div className="flex items-center mb-4">
              <TeamOutlined className="text-gray-600 mr-2" />
              <span className="text-sm">Min Players: {sport.min_Players}</span>
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => handleSportsModal(sport)} // Pass sport to open edit mode
              >
                <EditOutlined />
              </button>
              <Popconfirm
                title="Deleting Request"
                description="Are you sure to delete this Sports?"
                onConfirm={() => handleDelete(sport.id)} // Call delete function on confirm
                okText="Yes"
                cancelText="No"
              >
                <button className="text-red-600 hover:text-red-800">
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            </div>
          </div>
        ))}

        {openSportsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <AddSports
                onClose={closeSportsModal}
                initialData={selectedSport}
                fetchSports={fetchSports}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DisplaySports;
