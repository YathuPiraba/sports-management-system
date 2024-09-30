import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Card, Table } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchMemberDetailsApi } from "../../Services/apiServices";
import { GridLoader } from "react-spinners";

const MemberProfile = () => {
  const { memberId } = useParams(); // Get member ID from URL
  const [memberDetails, setMemberDetails] = useState(null); // State to hold fetched data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch member details when the component mounts
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetchMemberDetailsApi(memberId);
        setMemberDetails(response.data.data);
      } catch (error) {
        console.error("Failed to fetch member details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId]);

  console.log(memberDetails);

  const infoItems = [
    {
      label: "Position",
      value: `${memberDetails?.position || "N/A"} `,
    },
    { label: "E-mail", value: memberDetails?.user?.email || "N/A" },
    { label: "Age", value: memberDetails?.age || "N/A" },
    { label: "NIC", value: memberDetails?.nic || "N/A" },
    { label: "G.N Division", value: memberDetails?.divisionName || "N/A" },

    { label: "Joined Date", value: memberDetails?.created_at || "N/A" },
  ];

  const recentGamesColumns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Opp", dataIndex: "opponent", key: "opponent" },
    { title: "Result", dataIndex: "result", key: "result" },
    { title: "Min", dataIndex: "minutes", key: "minutes" },
    { title: "Pts", dataIndex: "points", key: "points" },
    { title: "Reb", dataIndex: "rebounds", key: "rebounds" },
    { title: "Ast", dataIndex: "assists", key: "assists" },
    { title: "Stl", dataIndex: "steals", key: "steals" },
    { title: "Blk", dataIndex: "blocks", key: "blocks" },
  ];

  const sportsSkills = memberDetails?.sports?.map((sport, index) => (
    <div key={index}>
      <h3 className="text-lg font-bold">Sport {index + 1}</h3>
      <ul>
        <p>{sport.sport_name}</p>
        {sport.skills?.map((skill, skillIndex) => (
          <li key={skillIndex}>{skill.skill_name}</li>
        )) || <li>No skills available</li>}
      </ul>
    </div>
  ));

  const bioDetails = [
    {
      label: "Contact Number",
      value: memberDetails?.contactNo || "Not available",
    },
    {
      label: "WhatsApp Number",
      value: memberDetails?.whatsappNo || "Not available",
    },
    {
      label: "Date of Birth",
      value: memberDetails?.date_of_birth || "Not available",
    },
    {
      label: "Experience",
      value: memberDetails?.experience
        ? `${memberDetails?.experience}`
        : "Not available",
    },
  ];

  const tabItems = [
    {
      label: "PLAYER INFO",
      key: "1",
      children: (
        <Table
          dataSource={memberDetails?.recentGames || []}
          columns={recentGamesColumns}
          pagination={false}
          size="small"
        />
      ),
    },
    {
      label: "STATS",
      key: "2",
      children: <p>Stats Content</p>,
    },
    {
      label: "SPORTS",
      key: "3",
      children: (
        <div>
          {sportsSkills?.length > 0 ? (
            sportsSkills
          ) : (
            <p>No sports skills available</p>
          )}
        </div>
      ),
    },
    {
      label: "COMPARISONS",
      key: "4",
      children: <p>Comparisons Content</p>,
    },
    {
      label: "BIO",
      key: "5",
      children: (
        <div>
          {bioDetails.map((item, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm text-blue-300">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
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
    <div className="bg-blue-900 p-4 text-white">
      <div className="flex items-center space-x-4 mb-4">
        {memberDetails?.user?.image ? (
          <img
            src={memberDetails?.user?.image}
            alt={memberDetails.firstName}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <UserOutlined className="text-6xl" />
        )}
        <div>
          <h2 className="text-2xl font-bold">
            {memberDetails
              ? `${memberDetails?.firstName} ${memberDetails?.lastName}`
              : "Unknown Player"}
          </h2>
          <p>{memberDetails?.club?.clubName || "Unknown Team"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {infoItems.map((item, index) => (
          <Card key={index} className="bg-blue-800 text-white">
            <p className="text-sm text-blue-300">{item.label}</p>
            <p className="font-semibold">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-white">
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>
    </div>
  );
};

export default MemberProfile;
