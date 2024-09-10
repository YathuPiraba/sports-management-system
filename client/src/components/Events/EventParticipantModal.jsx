import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { getMembersBySportsAPI } from "../../Services/apiServices";
import { useSelector } from "react-redux";
import { IoAddCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const EventParticipantModal = ({
  open,
  onOk,
  onCancel,
  sports_id,
  min_players,
  name,
}) => {
  const userId = useSelector((state) => state.auth.userdata.userId);
  const [memberList, setMemberList] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [addedParticipants, setAddedParticipants] = useState([]);

  const fetchMembers = async () => {
    try {
      const response = await getMembersBySportsAPI(userId, sports_id);
      const members = response.data.data;
      setMemberList(members);
      setAvailableMembers(members);
    } catch (error) {
      toast.error("Failed to fetch members.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [userId, sports_id]);

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

  return (
    <Modal
      title={`${name} Participant Form`}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      className="text-center"
      width={700}
      maskClosable={false}
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
            <div className="absolute top-10 right-2 text-red-500 font-semibold">
              {`${neededPlayers} more ${
                neededPlayers == 1 ? "player" : "players"
              }  needed..!`}
            </div>
          )}
          <ol className="list-decimal pl-4 space-y-2">
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
