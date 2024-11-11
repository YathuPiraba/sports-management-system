import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";
import {
  getMembersBySportsAPI,
  addEventParticipantsAPI,
} from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { IoAddCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const EventParticipantModal = ({
  open,
  onOk,
  onCancel,
  sports_id,
  min_players,
  name,
  eventSportsId,
}) => {
  const userId = useSelector((state) => state.auth.userdata.userId);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [addedParticipants, setAddedParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await getMembersBySportsAPI(userId, sports_id);
      const members = response.data.data;
      setAvailableMembers(members);
    } catch (error) {
      toast.error("Failed to fetch members.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [userId, sports_id]);

  const handleCancel = () => {
    setAddedParticipants([]);
    fetchMembers();
    onCancel();
  };

  const handleAddMember = (member) => {
    setAvailableMembers((prev) =>
      prev.filter((m) => m.member_id !== member.member_id)
    );
    setAddedParticipants((prev) => [...prev, member]);
  };

  const handleRemoveMember = (member) => {
    setAddedParticipants((prev) =>
      prev.filter((m) => m.member_id !== member.member_id)
    );
    setAvailableMembers((prev) => [...prev, member]);
  };

  // Calculate the remaining needed players
  const neededPlayers = Math.max(
    min_players -
      addedParticipants.filter((member) =>
        member.member_sports.some((sport) => sport.skills.length > 0)
      ).length,
    0
  );

  const handleSaveParticipants = async () => {
    setLoading(true);
    try {
      const clubId = addedParticipants[0]?.club_id;

      const participants = addedParticipants.map((member) => ({
        member_sports_id: member.member_sports[0]?.id,
      }));

      const payload = {
        club_id: clubId,
        event_sports_id: eventSportsId,
        participants,
      };

      await addEventParticipantsAPI(payload);
      toast.success("Event participants applied successfully!");
      setAddedParticipants([]);
      fetchMembers();
      onOk();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add participants to the event.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${name} Participant Form`}
      open={open}
      onOk={handleSaveParticipants}
      onCancel={handleCancel}
      className="text-center"
      width={700}
      maskClosable={false}
      okText="Apply"
      footer={
        <div className="flex gap-5 justify-center">
          <Button
            onClick={handleSaveParticipants}
            className={`px-4 py-5 rounded ${
              neededPlayers === 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={neededPlayers !== 0}
            loading={loading}
          >
            Apply
          </Button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mr-2"
          >
            Cancel
          </button>
        </div>
      }
    >
      <div className="flex bg-gray-200 p-4 text-left">
        {/* Available Members */}
        <div className="w-1/2 p-4 bg-white border border-gray-300 rounded">
          <h3 className="text-lg font-semibold mb-4">Available Members</h3>
          <ol className="list-decimal pl-4 space-y-2">
            {availableMembers.map((member, index) => (
              <li
                key={member.member_id}
                className="flex items-center space-x-2"
              >
                <span className="flex-shrink-0">{index + 1}.</span>
                <span className="flex-grow">
                  {`${member.firstName} ${member.lastName} - ${
                    member.member_sports.some(
                      (sport) => sport.skills.length > 0
                    )
                      ? member.member_sports
                          .flatMap((sport) => sport.skills)
                          .map((skill) => skill.skill_name)
                          .join(", ")
                      : member.member_position
                  }`}
                </span>
                <IoAddCircleOutline
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleAddMember(member)}
                />
              </li>
            ))}
          </ol>
        </div>
        {/* Added Participants */}
        <div className="w-1/2 p-4 bg-white border border-gray-300 rounded ml-4 relative">
          <h3 className="text-lg font-semibold mb-4">Added Participants</h3>
          {/* Display the message if neededPlayers > 0 */}
          {neededPlayers > 0 && (
            <div className="absolute top-11 right-2 text-red-500 font-semibold">
              {`${neededPlayers} more ${
                neededPlayers === 1 ? "player" : "players"
              } needed..!`}
            </div>
          )}
          <ol
            className={`list-decimal pl-4 ${
              neededPlayers === 0 ? "mt-0" : "mt-6"
            } space-y-2`}
          >
            {addedParticipants.map((member, index) => (
              <li
                key={member.member_id}
                className="flex items-center space-x-2"
              >
                <span className="flex-shrink-0">{index + 1}.</span>
                <span className="flex-grow">
                  {`${member.firstName} ${member.lastName} - ${
                    member.member_sports.some(
                      (sport) => sport.skills.length > 0
                    )
                      ? member.member_sports
                          .flatMap((sport) => sport.skills)
                          .map((skill) => skill.skill_name)
                          .join(", ")
                      : member.member_position
                  }`}
                </span>
                <IoCloseCircleOutline
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleRemoveMember(member)}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
};

export default EventParticipantModal;
