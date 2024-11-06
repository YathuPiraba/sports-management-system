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
  const [selectedSkills, setSelectedSkills] = useState({});

  // Fetch skills for a sport based on sport ID
  const fetchSkillOptions = async (sportId) => {
    try {
      const response = await getSkillsBySportsAPI(sportId);
      console.log('====================================');
      console.log(response.data);
      console.log('====================================');
      return response.data;
    } catch (error) {
      console.error("Error fetching skill options:", error);
      return [];
    }
  };

  // Initialize selected skills and fetch all available skills
  const initializeSkillsAndFetch = async () => {
    // Initialize selected skills from memberDetails
    const initialSelectedSkills = {};
    sports.forEach((sport, sportIndex) => {
      if (memberDetails.sports[sportIndex]?.skills?.[0]) {
        initialSelectedSkills[sport.sport_id] =
          memberDetails.sports[sportIndex].skills[0];
      }
    });
    setSelectedSkills(initialSelectedSkills);

    // Fetch all available skills for each sport
    const updatedSports = await Promise.all(
      sports.map(async (sport) => {
        const skills = await fetchSkillOptions(sport.sport_id);
        return { ...sport, allSkills: skills };
      })
    );

    // Create a map of all skill options for each sport
    const skillOptionsMap = updatedSports.reduce((acc, sport) => {
      acc[sport.sport_id] = sport.allSkills;
      return acc;
    }, {});
    setSkillOptions(skillOptionsMap);
  };

  useEffect(() => {
    initializeSkillsAndFetch();
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
      // Transform the sports data to include selected skills
      const updatedSportsData = sports.map((sport) => ({
        ...sport,
        skills: [selectedSkills[sport.sport_id]].filter(Boolean),
      }));

      await updateMemberSportsAPI(userId, { sports: updatedSportsData });
      fetchMemberDetails();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating sports:", error);
    }
  };

  const handleRemoveSport = (index) => {
    const updatedSports = [...sports];
    const removedSport = updatedSports[index];
    updatedSports.splice(index, 1);
    setSports(updatedSports);

    // Clean up selected skills
    const updatedSelectedSkills = { ...selectedSkills };
    delete updatedSelectedSkills[removedSport.sport_id];
    setSelectedSkills(updatedSelectedSkills);
  };

  const handleSkillChange = (sportId, newSkillId) => {
    const allSkillsForSport = skillOptions[sportId] || [];
    const newSelectedSkill = allSkillsForSport.find(
      (skill) => skill.skillId === newSkillId
    );

    setSelectedSkills((prev) => ({
      ...prev,
      [sportId]: newSelectedSkill,
    }));
  };

  const getAvailableSkillOptions = (sportId) => {
    const allSkills = skillOptions[sportId] || [];
    const selectedSkill = selectedSkills[sportId];

    return allSkills.filter(
      (skill) => !selectedSkill || skill.skillId !== selectedSkill.skillId
    );
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
              <div className="flex flex-wrap gap-2 items-center">
                {selectedSkills[sport.sport_id] && (
                  <Tag className="bg-gray-100 text-gray-800">
                    {selectedSkills[sport.sport_id].skill}
                  </Tag>
                )}
                <Select
                  className="w-40"
                  placeholder="Select skill"
                  value=""
                  onChange={(skillId) =>
                    handleSkillChange(sport.sport_id, skillId)
                  }
                >
                  {getAvailableSkillOptions(sport.sport_id).map((skill) => (
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
          <Button type="primary" onClick={handleSportsUpdate} className="mt-2">
            Update Sports
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpdateMemberSports;
