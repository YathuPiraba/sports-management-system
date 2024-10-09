import React, { useState, useEffect } from "react";
import { getEventParticipantsAPI } from "../../Services/apiServices";
import toast from "react-hot-toast";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Button, Tree } from "antd";
const { DirectoryTree } = Tree;
import { FaDownload, FaFilePdf } from "react-icons/fa";

const EventParticipantList = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const fetchParticipatingClubs = async () => {
    setLoading(true);
    try {
      const res = await getEventParticipantsAPI();
      const clubsData = res.data.data;
      const formattedTreeData = formatTreeData(clubsData);
      setTreeData(formattedTreeData);
      console.log(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching participation list");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (e, eventId) => {
    e.stopPropagation();
    // Here you would typically make an API call to your Laravel backend
    // to generate and download the PDF
    console.log(`Downloading PDF for event ID: ${eventId}`);
    // Example of how you might call your Laravel route:
    // window.location.href = `/api/download-event-pdf/${eventId}`;
  };

  const formatTreeData = (data) => {
    if (!data || !data.length) return [];

    return data.map((event) => ({
      title: (
        <div className="flex items-center justify-between">
          <span>{event.event_sports.name}</span>
          <Button
            icon={<FaFilePdf />}
            onClick={(e) => handleDownloadPDF(e, event.event_sports.id)}
            className="ml-2 text-red-500 event-part-btn"
          >
            <FaDownload />
          </Button>
        </div>
      ),
      key: `event-${event.event_sports.id}`,
      children: event.event_sports.clubs.map((club) => ({
        title: club.clubName,
        key: `club-${club.club_id}`,
        children: club.participants.map((participant) => ({
          title: `${participant.member.firstName} ${participant.member.lastName} (${participant.member.position})`,
          key: `member-${participant.member.id}`,
        })),
      })),
    }));
  };

  useEffect(() => {
    fetchParticipatingClubs();
  }, []);

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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  return (
    <div className="px-5 text-lg font-medium text-black mb-2 font-poppins flex gap-2 flex-wrap">
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

export default EventParticipantList;
