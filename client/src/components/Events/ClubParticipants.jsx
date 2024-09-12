import React, { useState, useEffect } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Tree } from "antd";
const { DirectoryTree } = Tree;

const ClubParticipants = ({ participants, fetchClubEvents, loading }) => {
  const [treeData, setTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const formatTreeData = (data) => {
    if (!data || !data.length) return [];

    return data.map((event) => ({
      title: event.name,
      key: `event-${event.id}`,
      children: event.participants.map((participant) => ({
        title: `${participant.member.firstName} ${participant.member.lastName} (${participant.member.position})`,
        key: `member-${participant.member.id}`,
      })),
    }));
  };

  useEffect(() => {
    // Assuming `participants` is the data fetched from `fetchClubEvents`
    const formattedTreeData = formatTreeData(participants);
    setTreeData(formattedTreeData);
  }, [participants]);

  const onSelect = (keys) => {
    // Filter out invalid or undefined keys
    const validKeys = keys.filter(
      (key) => key !== "undefined" && key !== undefined
    );

    // Handle key toggling
    if (validKeys.length === 0) {
      setSelectedKeys([]);
    } else {
      const selectedKey = validKeys[0];
      if (selectedKeys.includes(selectedKey)) {
        setSelectedKeys((prevKeys) =>
          prevKeys.filter((key) => key !== selectedKey)
        );
      } else {
        setSelectedKeys(() => [selectedKey]);
      }
    }

    console.log("Selected keys:", validKeys);
    console.log("Updated selected keys:", selectedKeys);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  return (
    <div className="px-5 text-lg font-medium text-black mb-2 gap-5 flex flex-wrap font-poppins">
      {treeData.map((event) => (
        <div key={event.key} className="mb-4">
          <DirectoryTree
            treeData={[event]}
            showIcon={false}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            className="border rounded-md border-blue-400 w-fit p-2 bg-blue-50"
          />
        </div>
      ))}
    </div>
  );
};

export default ClubParticipants;
