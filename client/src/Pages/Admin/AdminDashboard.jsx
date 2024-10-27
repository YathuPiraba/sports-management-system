import React, { lazy, useEffect, useState, Suspense } from "react";
import { getCountsAPI } from "../../Services/apiServices";
import {
  PlusOutlined,
  UsergroupAddOutlined,
  TrophyOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { GridLoader } from "react-spinners";
const AddSports = lazy(() => import("../../Components/Dashboard/AddSports"));

const AdminDashboard = () => {
  const [totalClubs, setTotalClubs] = useState(null);
  const [totalMembers, setTotalMembers] = useState(null);
  const [totalSports, setTotalSports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSportsModal, setOpenSportsModel] = useState(false);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const res = await getCountsAPI();
      setTotalSports(res.data.totalSports);
      setTotalClubs(res.data.totalClubs);
      setTotalMembers(res.data.totalMembers);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSportsModal = () => {
    setOpenSportsModel(true);
  };

  const closeSportsModal = () => {
    setOpenSportsModel(false);
  };

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
      <div className="px-6 max-h-screen ">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 max-w-xs bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="text-2xl mr-4">
              <FlagOutlined />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Clubs</h3>
              <p className="text-xl font-bold">{totalClubs}</p>
            </div>
          </div>
          <div className="flex-1 max-w-xs bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="text-2xl mr-4">
              <UsergroupAddOutlined />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Members</h3>
              <p className="text-xl font-bold">{totalMembers}</p>
            </div>
          </div>
          <div className="flex-1 max-w-xs bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="text-2xl mr-4">
              <TrophyOutlined />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Sports</h3>
              <p className="text-xl font-bold">{totalSports}</p>
            </div>
          </div>
        </div>

        <button
          className="bg-blue-500 text-white rounded-md px-4 py-2 text-lg flex items-center hover:bg-blue-600"
          onClick={handleSportsModal}
        >
          <PlusOutlined className="mr-2" /> Add Sport
        </button>

        {openSportsModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <AddSports onClose={closeSportsModal} />
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default AdminDashboard;
