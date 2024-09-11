import React, { useState, useEffect } from "react";
import { getEventParticipantsAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Tree } from "antd";
const { DirectoryTree } = Tree;

const EventParticipantList = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const fetchParticipatingClubs = async () => {
    setLoading(true);
    try {
      const res = await getEventParticipantsAPI();
      const clubsData = res.data.data;
      const formattedTreeData = formatTreeData(clubsData);
      setTreeData(formattedTreeData);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching participation list");
    } finally {
      setLoading(false);
    }
  };

  const formatTreeData = (data) => {
    if (!data || !data.length) return [];

    return data.map((event) => ({
      title: event.event_sports.name,
      key: `event-${event.id}`,
      children: [
        {
          title: event.clubName,
          key: `club-${event.club_id}`,
          children: event.participants.map((participant, index) => ({
            title: `${participant.member.firstName} ${participant.member.lastName} (${participant.member.position})`,
            key: `member-${participant.member.id}-${index}`,
          })),
        },
      ],
    }));
  };

  useEffect(() => {
    fetchParticipatingClubs();
  }, []);

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onExpand = (keys) => {
    setExpandedKeys(keys);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  return (
    <div className="px-5  text-lg font-medium text-black mb-2 font-poppins">
      <DirectoryTree
        multiple
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
        showIcon={false}
        className="border rounded-md border-blue-400 w-fit p-2 bg-slate-200"
      />
    </div>
  );
};

export default EventParticipantList;
