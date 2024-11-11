import React, { useState, useEffect } from "react";
import {
  updateMemberDetailsApi,
  updateMemberSportsAPI,
  getSkillsBySportsAPI,
  getAClubSportsAPI,
} from "../../Services/apiServices";
import { Button, Input, Card, Tag, Select } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import toast from "react-hot-toast";

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
  const [availableSports, setAvailableSports] = useState([]);
  const [newSportId, setNewSportId] = useState(null);
  const [newSkillId, setNewSkillId] = useState(null);
  const [newSportSkills, setNewSportSkills] = useState([]);

  const fetchSports = async () => {
    try {
      const response = await getAClubSportsAPI(memberDetails.club.clubName);
      const uniqueSports = Array.from(
        new Map(response.data.map((item) => [item.sports_id, item])).values()
      );

      // Filter out sports that are already selected
      const existingSportIds = sports.map((sport) => sport.sport_id);
      const filteredSports = uniqueSports.filter(
        (sport) => !existingSportIds.includes(sport.sports_id)
      );

      setAvailableSports(filteredSports);
    } catch (error) {
      console.log("Error fetching sports data:", error);
    }
  };

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

  // Initialize selected skills and fetch all available skills
  const initializeSkillsAndFetch = async () => {
    const initialSelectedSkills = {};
    sports.forEach((sport, sportIndex) => {
      if (memberDetails.sports[sportIndex]?.skills?.[0]) {
        initialSelectedSkills[sport.sport_id] =
          memberDetails.sports[sportIndex].skills[0];
      }
    });
    setSelectedSkills(initialSelectedSkills);

    const updatedSports = await Promise.all(
      sports.map(async (sport) => {
        const skills = await fetchSkillOptions(sport.sport_id);
        return { ...sport, allSkills: skills };
      })
    );

    const skillOptionsMap = updatedSports.reduce((acc, sport) => {
      acc[sport.sport_id] = sport.allSkills;
      return acc;
    }, {});
    setSkillOptions(skillOptionsMap);
  };

  useEffect(() => {
    initializeSkillsAndFetch();
    fetchSports();
  }, []);

  // Fetch skills when new sport is selected
  useEffect(() => {
    const fetchAndSetNewSportSkills = async () => {
      if (newSportId) {
        try {
          const skills = await fetchSkillOptions(newSportId);
          // Ensure the skills data is properly formatted
          setNewSportSkills(
            skills.map((skill) => ({
              id: skill.skillId || skill.id,
              skill: skill.skill,
            }))
          );
        } catch (error) {
          console.error("Error fetching skills for the new sport:", error);
          setNewSportSkills([]);
        }
      } else {
        setNewSportSkills([]);
      }
    };

    fetchAndSetNewSportSkills();
    setNewSkillId(null);
  }, [newSportId]);

  const handleExperienceUpdate = async () => {
    try {
      await updateMemberDetailsApi(userId, { experience });
      fetchMemberDetails();
      toast.success("Experience Updated Successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating experience");
      console.error("Error updating experience:", error);
    }
  };

  const handleSportsUpdate = async () => {
    try {
      const updatedSportsData = sports.map((sport) => ({
        ...sport,
        skills: [selectedSkills[sport.sport_id]].filter(Boolean),
      }));

      await updateMemberSportsAPI(userId, { sports: updatedSportsData });
      fetchMemberDetails();
      toast.success("Sports Updated Successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating sports");
      console.error("Error updating sports:", error);
    }
  };

  const handleRemoveSport = (index) => {
    const updatedSports = [...sports];
    const removedSport = updatedSports[index];
    updatedSports.splice(index, 1);
    setSports(updatedSports);

    const updatedSelectedSkills = { ...selectedSkills };
    delete updatedSelectedSkills[removedSport.sport_id];
    setSelectedSkills(updatedSelectedSkills);

    // Update available sports list with the removed sport
    const sportToAdd = availableSports.find(
      (s) => s.sports_id === removedSport.sport_id
    ) || {
      sports_id: removedSport.sport_id,
      sportsName: removedSport.sport_name,
    };
    setAvailableSports((prev) => [...prev, sportToAdd]);
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

  const handleAddNewSport = () => {
    if (newSportId && newSkillId) {
      const selectedSport = availableSports.find(
        (sport) => sport.sports_id === newSportId
      );
      const selectedSkill = newSportSkills.find(
        (skill) => skill.id === newSkillId
      );

      if (!selectedSport || !selectedSkill) {
        console.error("Selected sport or skill not found");
        return;
      }

      // Add new sport to sports list
      const newSport = {
        sport_id: selectedSport.sports_id,
        sport_name: selectedSport.sportsName,
        skills: [{ skillId: selectedSkill.id, skill: selectedSkill.skill }],
      };

      setSports((prev) => [...prev, newSport]);
      setSelectedSkills((prev) => ({
        ...prev,
        [selectedSport.sports_id]: {
          skillId: selectedSkill.id,
          skill: selectedSkill.skill,
        },
      }));

      // Remove selected sport from available sports
      setAvailableSports((prev) =>
        prev.filter((sport) => sport.sports_id !== newSportId)
      );

      // Reset selection
      setNewSportId(null);
      setNewSkillId(null);
    }
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
          {/* Existing Sports */}
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
                  value={selectedSkills[sport.sport_id]?.skill || undefined}
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

          {/* Add New Sport */}
          <div className="flex items-center gap-4 mt-4 border rounded-lg border-gray-200 p-4">
            <Select
              className="w-40"
              placeholder="Select sport"
              value={newSportId}
              onChange={setNewSportId}
            >
              {availableSports.map((sport) => (
                <Option key={sport.sports_id} value={sport.sports_id}>
                  {sport.sportsName}
                </Option>
              ))}
            </Select>
            <Select
              className="w-40"
              placeholder="Select skill"
              value={newSkillId}
              onChange={setNewSkillId}
              disabled={!newSportId}
            >
              {newSportSkills.map((skill) => (
                <Option key={skill.id} value={skill.id}>
                  {skill.skill}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={handleAddNewSport}
              disabled={!newSportId || !newSkillId}
            >
              Add Sport
            </Button>
          </div>

          <Button type="primary" onClick={handleSportsUpdate} className="mt-4">
            Update Sports
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpdateMemberSports;
