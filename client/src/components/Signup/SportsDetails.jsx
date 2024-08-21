import React, { useState, useEffect } from "react";
import {
  getAClubSportsAPI,
  getSkillsBySportsAPI,
} from "../../Services/apiServices";
import { TiDelete } from "react-icons/ti";

const SportsDetails = ({ clubs }) => {
  const [clubName, setClubName] = useState("");
  const [position, setPosition] = useState("");
  const [sports, setSports] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    if (clubName) {
      fetchSportsByClub(clubName);
    }
  }, [clubName]);

  const fetchSportsByClub = async (clubName) => {
    try {
      const response = await getAClubSportsAPI(clubName);
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports for club:", error);
    }
  };

  const handleSportChange = async (e) => {
    const sportName = e.target.value;
    setSelectedSport(sportName);

    // Fetch skills only if position is Player
    if (position === "Player") {
      try {
        const response = await getSkillsBySportsAPI(sportName);
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
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleClubNameChange = (e) => {
    setClubName(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  return (
    <div>
      <div className="mt-2">
        <label>Club Name:</label>
        <select
          name="clubName"
          value={clubName}
          onChange={handleClubNameChange}
        >
          <option value="">Select a Club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.clubName}>
              {club.clubName}
            </option>
          ))}
        </select>
        <label>Position:</label>
        <select
          name="position"
          value={position}
          onChange={handlePositionChange}
        >
          <option value="">Select Position</option>
          <option value="Coach">Coach</option>
          <option value="Player">Player</option>
        </select>
      </div>

      {position && (
        <div>
          <label>Sports:</label>
          <select onChange={handleSportChange} value={selectedSport}>
            <option value="">Select a Sport</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.sportsName}>
                {sport.sportsName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render skills dropdown only if position is Player and skills are available */}
      {position === "Player" && skills.length > 0 && (
        <div>
          <label>Skills:</label>
          <select onChange={(e) => handleSkillSelect(e.target.value)}>
            <option value="">Select a Skill</option>
            {skills.map((skillName) => (
              <option key={skillName.id} value={skillName.skill}>
                {skillName.skill}
              </option>
            ))}
          </select>
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
                  {item.sport} - {item.skill} 
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
        </div>
      )}
    </div>
  );
};

export default SportsDetails;
