import React from "react";
import { PlusOutlined, UsergroupAddOutlined, TrophyOutlined, FlagOutlined } from "@ant-design/icons";

const AdminDashboard = () => {
  // Mock data (replace with actual data fetching logic)
  const totalClubs = 50;
  const totalMembers = 1000;
  const totalSports = 15;

  return (
    <div className="p-6 min-h-screen ">
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
      
      <button className="bg-blue-500 text-white rounded-md px-4 py-2 text-lg flex items-center hover:bg-blue-600">
        <PlusOutlined className="mr-2" /> Add Sport
      </button>
    </div>
  );
};

export default AdminDashboard;
