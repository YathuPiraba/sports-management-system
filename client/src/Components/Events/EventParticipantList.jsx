import React, { useState, useEffect } from "react";
import {
  downloadEventSportsDetailsAPI,
  getEventParticipantsAPI,
} from "../../Services/apiServices";
import toast from "react-hot-toast";
import { FadeLoader, PropagateLoader } from "react-spinners";
import { Button, message, Tree } from "antd";
const { DirectoryTree } = Tree;
import { TbFileExport } from "react-icons/tb";

const EventParticipantList = ({ eventId }) => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchParticipatingClubs = async () => {
    setLoading(true);
    try {
      const res = await getEventParticipantsAPI(eventId);
      const clubsData = res.data.data;
      console.log(res.data.data);

      setTreeData(formatTreeData(clubsData));
    } catch (error) {
      console.error(error);
      toast.error("Error fetching participation list");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (e, eventSportsId, eventSportsName) => {
    e.stopPropagation();
    setDownloadLoading((prevState) => ({
      ...prevState,
      [eventSportsId]: true,
    }));
    setIsDownloading(true);

    try {
      const response = await downloadEventSportsDetailsAPI(eventSportsId);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${eventSportsName} - participation details.pdf`;
      link.click();

      message.success("Event details downloaded successfully");
    } catch (error) {
      console.error("Error downloading club details:", error);
      message.error("Failed to download club details. Please try again.");
    } finally {
      setDownloadLoading((prevState) => ({
        ...prevState,
        [eventSportsId]: false,
      }));
      setIsDownloading(false);
    }
  };

  const formatTreeData = (data) => {
    if (!Array.isArray(data)) {
      // If it's not an array, convert the object to an array using Object.values()
      data = Object.values(data);
    }

    return data.map((event) => ({
      title: (
        <div className="flex items-center justify-between">
          <span>{event.event_sports.name}</span>
          <Button
            onClick={(e) =>
              handleDownloadPDF(
                e,
                event.event_sports.id,
                event.event_sports.name
              )
            }
            className="ml-2 text-sky-500 event-part-btn border-sky-500 px-2"
            loading={downloadLoading[event.event_sports.id]}
          >
            <TbFileExport size={20} />
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
  }, [eventId]);

  const onSelect = (keys) => {
    const validKeys = keys.filter(
      (key) => key !== "undefined" && key !== undefined
    );

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
    <>
      {isDownloading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm z-50">
          <FadeLoader color="skyblue" />
        </div>
      )}
      <div className="px-5 text-lg font-medium text-black mb-2 font-poppins flex gap-2 flex-wrap">
        {treeData.length === 0 ? (
          <div className="w-full h-[50vh] flex justify-center items-center">
            <p className="text-gray-500 text-xl">No participants until now</p>
          </div>
        ) : (
          treeData.map((event) => (
            <div key={event.key} className="mb-4">
              <DirectoryTree
                treeData={[event]}
                showIcon={false}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                className="border rounded-md border-blue-400 w-fit p-2 bg-blue-50"
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default EventParticipantList;
