import React, { useState, useEffect } from "react";
import {
  updateMemberDetailsApi,
  updateMemberSportsAPI,
  getSkillsBySportsAPI,
} from "../../Services/apiServices";
import { Button, Input, Card, Tag, Select } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
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
  const [skillOptions, setSkillOptions] = useState({});

  // Fetch skills for a sport based on sport ID
  const fetchSkillOptions = async (sportId) => {
    try {
      const response = await getSkillsBySportsAPI(sportId);
      return response.data;
    } catch (error) {
      console.error("Error fetching skill options:", error);
      return [];
    }
  };

  const fetchSkillsForSports = async () => {
    const updatedSports = await Promise.all(
      sports.map(async (sport) => {
        const skills = await fetchSkillOptions(sport.sport_id);
        return { ...sport, skills };
      })
    );
    setSports(updatedSports);

    // Create a map of skill options for each sport
    const skillOptionsMap = updatedSports.reduce((acc, sport) => {
      acc[sport.sport_id] = sport.skills;
      return acc;
    }, {});
    console.log(skillOptionsMap);
    
    setSkillOptions(skillOptionsMap);
  };

  // Fetch skills when sports changes
  useEffect(() => {
    fetchSkillsForSports();
  }, []);

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

  const handleRemoveSport = (index) => {
    const updatedSports = [...sports];
    updatedSports.splice(index, 1);
    setSports(updatedSports);
  };


  const handleRemoveSkill = (sportIndex, skillIndex) => {
    const updatedSports = [...sports];
    updatedSports[sportIndex].skills.splice(skillIndex, 1);
    setSports(updatedSports);
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
          {sports.map((sport, sportIndex) => (
            <div
              key={sportIndex}
              className="flex items-center justify-between mb-3 border rounded-lg border-gray-200 p-4"
            >
              <Meta title={sport.sport_name} />
              <div className="flex flex-wrap gap-2">
                {memberDetails.sports[sportIndex].skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center">
                    <Tag
                      closable
                      onClose={() => handleRemoveSkill(sportIndex, skillIndex)}
                      className="bg-gray-100 text-gray-800 mr-2"
                    >
                      {skill.skill_name}
                    </Tag>
                  </div>
                ))}
                <Select
                  className="w-40"
                  placeholder="Add new skill"
                >
                  {skillOptions[sport.sport_id]?.map((skill) => (
                    <Option key={skill.skillId} value={skill.skillId}>
                      {skill.skill}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center ml-2">
                <CloseCircleOutlined
                  onClick={() => handleRemoveSport(sportIndex)}
                  style={{ cursor: "pointer", marginLeft: 8 }}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              type="text"
            //   value={newSportName}
              onChange={(e) => setNewSportName(e.target.value)}
              placeholder="Add new sport"
              className="flex-1"
            />
            {/* <Button type="primary" onClick={handleAddSport}>
              Add
            </Button> */}
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