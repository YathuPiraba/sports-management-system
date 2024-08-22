import React, { useState, useEffect } from "react";
import {
  getAClubSportsAPI,
  getSkillsBySportsAPI,
} from "../../Services/apiServices";
import { TiDelete } from "react-icons/ti";

const SportsDetails = ({ clubs, onSportsDetailsChange }) => {
  const [clubName, setClubName] = useState("");
  const [position, setPosition] = useState("");
  const [sports, setSports] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState("");

  useEffect(() => {
    if (clubName) {
      fetchSportsByClub(clubName);
    }
  }, [clubName]);

  useEffect(() => {
    onSportsDetailsChange({
      clubName,
      position,
      selectedSport,
      selectedSkills,
      experience: position === "Coach" ? experience : undefined,
    });
  }, [position, selectedSport, selectedSkills, experience]);

  const fetchSportsByClub = async (clubName) => {
    try {
      const response = await getAClubSportsAPI(clubName);
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports for club:", error);
    }
  };

  const handleSportChange = async (sportsId) => {
    setSelectedSport(sportsId);

    if (position === "Player") {
      try {
        const response = await getSkillsBySportsAPI(sportsId);
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills for sport:", error);
      }
    }

    onSportsDetailsChange({
      clubName,
      position,
      sports: sportsId,
      experience,
    });
  };

  const handleSkillSelect = (skillId) => {
    if (skillId && position === "Player") {
      const selectedSkill = skills.find((s) => s.skillId == skillId);
      const skillName = selectedSkill ? selectedSkill.skill : "Unknown Skill";

      const existingSportIndex = selectedSkills.findIndex(
        (item) => item.sport === selectedSport
      );

      let updatedSkills;
      if (existingSportIndex >= 0) {
        updatedSkills = selectedSkills.map((item, index) =>
          index === existingSportIndex
            ? { ...item, skill: skillId, skillName }
            : item
        );
      } else {
        updatedSkills = [
          ...selectedSkills,
          { sport: selectedSport, skill: skillId, skillName },
        ];
      }

      setSelectedSkills(updatedSkills);

      onSportsDetailsChange({
        clubName,
        position,
        sports: updatedSkills,
      });
    }
  };

  const handleSkillRemove = (e, skillToRemove) => {
    e.preventDefault();
    if (position === "Player") {
      const updatedSkills = selectedSkills.filter(
        (skill) => skill.sport !== skillToRemove.sport
      );
      setSelectedSkills(updatedSkills);

      console.log(updatedSkills);

      onSportsDetailsChange({
        clubName,
        position,
        selectedSport,
        selectedSkills: updatedSkills,
      });
    }
  };

  const handleClubNameChange = (e) => {
    setClubName(e.target.value);
  };

  const handlePositionChange = (e) => {
    const newPosition = e.target.value;
    setPosition(newPosition);
    setSelectedSport("");
    setSelectedSkills([]);
    setExperience("");
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);

    onSportsDetailsChange({
      clubName,
      position,
      selectedSport,
      selectedSkills,
      experience: e.target.value,
    });
  };

  const getSportsName = (id) => {
    const sport = sports.find((s) => s.sports_id == id);
    return sport ? sport.sportsName : "Unknown Sport";
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col md:flex-row lg:flex-row md:gap-7">
        <div className="mt-2">
          <label className="mr-3">Club Name:</label>
          <select
            name="clubName"
            value={clubName}
            onChange={handleClubNameChange}
            className="border rounded-md p-1.5 w-max"
          >
            <option value="">Select a Club</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.clubName}>
                {club.clubName}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-8 md:mt-2 ">
          <label className="mr-1 md:mr-0 lg:mr-0">Position:</label>
          <select
            name="position"
            value={position}
            onChange={handlePositionChange}
            className="border rounded-md ml-7 sm:ml-9 min-w-40 md:w-48 lg:w-48 p-1.5"
          >
            <option value="">Select Position</option>
            <option value="Coach">Coach</option>
            <option value="Player">Player</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row lg:flex-row md:gap-7">
        {position && clubName && (
          <div className="mt-8">
            <label className="mr-9">Sports:</label>
            <select
              onChange={(e) => handleSportChange(e.target.value)}
              value={selectedSport}
              className="border rounded-md ml-2 min-w-40 md:w-40 p-1.5"
            >
              <option value="">Select a Sport</option>
              {sports.map((sport) => (
                <option key={sport.sports_id} value={sport.sports_id}>
                  {sport.sportsName}
                </option>
              ))}
            </select>
          </div>
        )}
        {position === "Player" && selectedSport && (
          <div className="mt-8">
            <label className="mr-4 sm:mr-5 ">Skills:</label>
            <select
              onChange={(e) => handleSkillSelect(e.target.value)}
              className="border rounded-md ml-9 md:ml-9 sm:ml-16 min-w-40 p-1.5"
            >
              <option value="">Select a Skill</option>
              {skills.map((skillName) => (
                <option key={skillName.skillId} value={skillName.skillId}>
                  {skillName.skill}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {!selectedSport && (
        <div
          className="mt-4 p-4 h-40 border rounded-md bg-gray-100 flex flex-wrap"
          style={{
            width: "100%",
            border: "2px solid #ccc",
          }}
        ></div>
      )}
      {position === "Player" && selectedSport && (
        <fieldset
          className=" mt-4 p-4 border rounded-md bg-gray-100 flex flex-wrap"
          style={{
            minHeight: "150px",
            width: "100%",
            border: "2px solid #ccc",
          }}
        >
          <legend className="text-gray-500 px-2">
            Add your known sports and skills you have here
          </legend>

          {selectedSkills.length > 0 ? (
            selectedSkills.map((item, index) => (
              <div key={index} className="p-2 border-b flex items-center">
                {getSportsName(item.sport)} - {item.skillName}
                <button
                  className="ml-2 text-red-500"
                  onClick={(e) => handleSkillRemove(e, item)}
                >
                  <TiDelete />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No skills selected</p>
          )}
        </fieldset>
      )}

      {position === "Coach" && selectedSport && (
        <textarea
          className="w-full mt-4 p-4 h-40 border rounded-md bg-gray-100"
          placeholder="Tell Us About Your Experience Here"
          value={experience}
          onChange={handleExperienceChange}
          name="experience"
        />
      )}
    </div>
  );
};

export default SportsDetails;
