import React, { useState, useEffect } from "react";
import {
  getAClubSportsAPI,
  getSkillsBySportsAPI,
} from "../../Services/apiServices";

const SportsDetails = ({ clubName, position }) => {
  const [sports, setSports] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");

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

        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
      } catch (error) {
        console.error("Error fetching skills for sport:", error);
      }
    }
  };

  return (
    <div>
      {/* Render sports dropdown if the position is selected */}
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
          <select>
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
  );
};

export default SportsDetails;
