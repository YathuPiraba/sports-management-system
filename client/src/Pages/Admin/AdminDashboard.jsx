import React, { lazy, useEffect, useState, Suspense } from "react";
import { getCountsAPI } from "../../Services/apiServices";
import {
  UsergroupAddOutlined,
  TrophyOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { GridLoader } from "react-spinners";
const DisplaySports = lazy(() =>
  import("../../Components/Dashboard/DisplaySports")
);

import { useTheme } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const [totalClubs, setTotalClubs] = useState(null);
  const [totalMembers, setTotalMembers] = useState(null);
  const [totalSports, setTotalSports] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const res = await getCountsAPI();
      setTotalSports(res.data.totalSports);
      setTotalClubs(res.data.totalVerifiedClubs);
      setTotalMembers(res.data.totalVerifiedMembers);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

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
      <div className="px-6 min-h-screen ">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <div
            className={`flex-1 max-w-xs ${
              theme === "light" ? "bg-white" : "bg-gray-200 text-black"
            }  rounded-lg shadow-md p-4 flex items-center`}
          >
            <div className="text-2xl mr-4">
              <FlagOutlined />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Clubs</h3>
              <p className="text-xl font-bold">{totalClubs}</p>
            </div>
          </div>
          <div
            className={`flex-1 max-w-xs ${
              theme === "light" ? "bg-white" : "bg-gray-200 text-black"
            }  rounded-lg shadow-md p-4 flex items-center`}
          >
            <div className="text-2xl mr-4">
              <UsergroupAddOutlined />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Members</h3>
              <p className="text-xl font-bold">{totalMembers}</p>
            </div>
          </div>
          <div
            className={`flex-1 max-w-xs ${
              theme === "light" ? "bg-white" : "bg-gray-200 text-black"
            }  rounded-lg shadow-md p-4 flex items-center`}
          >
            <div className="text-2xl mr-4">
              <TrophyOutlined />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Sports</h3>
              <p className="text-xl font-bold">{totalSports}</p>
            </div>
          </div>
        </div>

        <DisplaySports theme={theme} />
      </div>
    </Suspense>
  );
};

export default AdminDashboard;
