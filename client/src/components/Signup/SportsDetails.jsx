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
  }, []);

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

    console.log(sportsId);

    // Fetch skills only if position is Player
    if (position === "Player") {
      try {
        const response = await getSkillsBySportsAPI(sportsId);
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills for sport:", error);
      }
    }
  };

  const handleSkillSelect = (skill) => {
    if (skill) {
      // Create an object with sport name and skill
      const sportSkill = { sport: selectedSport, skill };

      // Check if the sport is already in the selectedSkills array
      const existingSportIndex = selectedSkills.findIndex(
        (item) => item.sport === selectedSport
      );

      // If the sport is already selected, replace the skill
      if (existingSportIndex >= 0) {
        const updatedSkills = [...selectedSkills];
        updatedSkills[existingSportIndex] = sportSkill;
        setSelectedSkills(updatedSkills);
      } else {
        // Otherwise, add the new sport-skill combination
        setSelectedSkills([...selectedSkills, sportSkill]);
      }

      console.log([...selectedSkills, sportSkill]);

      onSportsDetailsChange({
        clubName,
        position,
        selectedSport,
        selectedSkills: [...selectedSkills, sportSkill],
        experience: position === "Coach" ? experience : undefined,
      });
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    const updatedSkills = selectedSkills.filter(
      (skill) => skill !== skillToRemove
    );
    setSelectedSkills(updatedSkills);

    console.log(updatedSkills);

    onSportsDetailsChange({
      clubName,
      position,
      selectedSport,
      selectedSkills: updatedSkills,
      experience: position === "Coach" ? experience : undefined,
    });
  };

  const handleClubNameChange = (e) => {
    setClubName(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
    if (e.target.value !== "Coach") {
      setExperience("");
    }
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
    <div className="mx-24">
      <div className="flex flex-row gap-7 mb-2">
        <div className="mt-2">
          <label className="mr-3">Club Name:</label>
          <select
            name="clubName"
            value={clubName}
            onChange={handleClubNameChange}
            className="border rounded-md p-1.5 w-60"
          >
            <option value="">Select a Club</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.clubName}>
                {club.clubName}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2">
          <label className="mr-1">Position:</label>
          <select
            name="position"
            value={position}
            onChange={handlePositionChange}
            className="border rounded-md ml-3 w-72 p-1.5"
          >
            <option value="">Select Position</option>
            <option value="Coach">Coach</option>
            <option value="Player">Player</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {position && clubName && (
          <div className="mt-2">
            <label className="mr-9">Sports:</label>
            <select
              onChange={(e) => handleSportChange(e.target.value)}
              value={selectedSport}
              className="border rounded-md ml-2 w-60 p-1.5"
            >
              <option value="">Select a Sport</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.sports_id}>
                  {sport.sportsName}
                </option>
              ))}
            </select>
          </div>
        )}
        {position === "Player" && selectedSport && (
          <div className="mt-2">
            <label className="mr-2">Skills:</label>
            <select
              onChange={(e) => handleSkillSelect(e.target.value)}
              className="border rounded-md ml-7 w-72 p-1.5"
            >
              <option value="">Select a Skill</option>
              {skills.map((skillName) => (
                <option key={skillName.id} value={skillName.skill}>
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
        <div
          className="mt-4 p-4 border rounded-md bg-gray-100 flex flex-wrap"
          style={{
            minHeight: "150px",
            width: "100%",
            border: "2px solid #ccc",
          }}
        >
          {selectedSkills.length > 0 ? (
            selectedSkills.map((item, index) => (
              <div key={index} className="p-2 border-b flex items-center">
                {getSportsName(item.sport)} - {item.skill}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => handleSkillRemove(item)}
                >
                  <TiDelete />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No skills selected</p>
          )}
        </div>
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
