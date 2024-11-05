import React, { useState, useEffect } from "react";
import {
  updateMemberDetailsApi,
  updateMemberSportsAPI,
  getSkillsBySportsAPI,
} from "../../Services/apiServices";
import { Button, Input, Card, Tag, Select } from "antd";
import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

const { Option } = Select;

const UpdateMemberSports = ({
  setIsModalOpen,
  user,
  memberDetails,
  fetchMemberDetails,
}) => {
  const userId = user?.userId;
  const [experience, setExperience] = useState(memberDetails.experience || "");
  const [sports, setSports] = useState(memberDetails.sports || []);
  const [newSportName, setNewSportName] = useState("");
  const [newSkillId, setNewSkillId] = useState(null);
  const [skillOptions, setSkillOptions] = useState([]);

  const fetchSkillOptions = async (sportId) => {
    try {
      const response = await getSkillsBySportsAPI(sportId);
      return response.data;
    } catch (error) {
      console.error("Error fetching skill options:", error);
      return [];
    }
  };

  const handleExperienceUpdate = async () => {
    try {
      await updateMemberDetailsApi(userId, { experience });
      fetchMemberDetails();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating experience:", error);
    }
  };

  const handleSportsUpdate = async () => {
    try {
      await updateMemberSportsAPI(userId, { sports });
      fetchMemberDetails();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating sports:", error);
    }
  };

  const handleAddSport = () => {
    if (newSportName.trim() !== "") {
      setSports([
        ...sports,
        {
          sport_name: newSportName,
          sport_id: Date.now(), // Temporary ID, should be replaced with actual ID from API
          skills: [],
        },
      ]);
      setNewSportName("");
    }
  };

  const handleRemoveSport = (index) => {
    const updatedSports = [...sports];
    updatedSports.splice(index, 1);
    setSports(updatedSports);
  };

  const handleRemoveSkill = (sportIndex, skillIndex) => {
    const updatedSports = [...sports];
    const updatedSkills = [...updatedSports[sportIndex].skills];
    updatedSkills.splice(skillIndex, 1);
    updatedSports[sportIndex].skills = updatedSkills;
    setSports(updatedSports);
  };

  const handleAddSkill = (sportIndex) => {
    if (newSkillId) {
      const updatedSports = [...sports];
      const selectedSkill = skillOptions.find(
        (skill) => skill.id === newSkillId
      );
      updatedSports[sportIndex].skills.push({
        skill_id: newSkillId,
        skill_name: selectedSkill.name,
      });
      setSports(updatedSports);
      setNewSkillId(null);
    }
  };

  const handleEditSkills = async (sportIndex) => {
    const sportId = sports[sportIndex].sport_id; // Adjust based on actual ID
    const skills = await fetchSkillOptions(sportId);
    setSkillOptions(skills);
  };

  return (
    <div className="space-y-4">
      {memberDetails.experience ? (
        <div>
          <label htmlFor="experience" className="block font-medium mb-2">
            Experience
          </label>
          <Input
            id="experience"
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full"
          />
          <Button
            type="primary"
            onClick={handleExperienceUpdate}
            className="mt-2"
          >
            Update Experience
          </Button>
        </div>
      ) : (
        <div>
          <h3 className="font-medium mb-2">Sports</h3>
          {sports.map((sport, sportIndex) => (
            <Card key={sport.sport_id} className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Meta title={sport.sport_name} />
                  <div className="flex items-center ml-2">
                    <EditOutlined
                      onClick={() => handleEditSkills(sportIndex)}
                      style={{ cursor: "pointer" }}
                    />
                    <CloseCircleOutlined
                      onClick={() => handleRemoveSport(sportIndex)}
                      style={{ cursor: "pointer", marginLeft: 8 }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h5 className="font-medium mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {sport.skills.map((skill, skillIndex) => (
                    <Tag
                      key={skillIndex}
                      closable
                      onClose={() => handleRemoveSkill(sportIndex, skillIndex)}
                      className="bg-gray-100 text-gray-800"
                    >
                      {skill.skill_name}
                    </Tag>
                  ))}
                  <div className="flex items-center gap-2">
                    <Select
                      value={newSkillId}
                      onChange={(value) => setNewSkillId(value)}
                      placeholder="Add new skill"
                      className="flex-1"
                    >
                      {skillOptions.map((skill) => (
                        <Option key={skill.id} value={skill.id}>
                          {skill.name}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      type="primary"
                      onClick={() => handleAddSkill(sportIndex)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newSportName}
              onChange={(e) => setNewSportName(e.target.value)}
              placeholder="Add new sport"
              className="flex-1"
            />
            <Button type="primary" onClick={handleAddSport}>
              Add
            </Button>
          </div>
          <Button type="primary" onClick={handleSportsUpdate} className="mt-2">
            Update Sports
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpdateMemberSports;
