import React from "react";
import {
  FaTrophy,
  FaMedal,
  //   FaCrowns,
  //   FaArrowUp,
  //   FaArrowDown,
} from "react-icons/fa"; // Import the icons from react-icons
import { PropagateLoader } from "react-spinners";

const Leaderboard = ({ stats, statsLoading }) => {
  if (statsLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <PropagateLoader loading={loading} size={10} color="#4682B4" />
      </div>
    );
  }

  if (!stats || stats.sports_winners.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        <p className="text-gray-500">No stats are available for this event.</p>
      </div>
    );
  }

  const isCompleted = stats.event_status === "completed";

  // Find overall champion (only for completed tournaments)
  const getOverallChampion = () => {
    if (!isCompleted) return null;

    const clubPoints = {};
    stats.sports_winners.forEach((sport) => {
      const winner = sport.winner;
      if (!clubPoints[winner.club_id]) {
        clubPoints[winner.club_id] = {
          club_name: winner.club_name,
          club_image: winner.club_image,
          total_points: 0,
          championships: 0,
        };
      }
      clubPoints[winner.club_id].total_points += winner.performance.points;
      clubPoints[winner.club_id].championships += 1;
    });

    return Object.values(clubPoints).sort(
      (a, b) =>
        b.total_points - a.total_points || b.championships - a.championships
    )[0];
  };

  const overallChampion = getOverallChampion();

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Tournament Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Tournament {isCompleted ? "Results" : "Standings"}
        </h1>
        <p className="text-gray-600">
          Total Sports: {stats.total_sports} | Status:{" "}
          {isCompleted ? "Completed" : "Ongoing"}
        </p>
      </div>

      {/* Overall Champion (only shown for completed tournaments) */}
      {isCompleted && overallChampion && (
        <div className="mb-8 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg p-6 shadow-md">
          <div className="flex flex-col items-center">
            <FaMedal className="w-12 h-12 text-yellow-500 mb-2" />
            <h2 className="text-xl font-bold text-center mb-2">
              Overall Tournament Champion
            </h2>
            <div className="flex items-center gap-4">
              {overallChampion.club_image && (
                <img
                  src={overallChampion.club_image}
                  alt={overallChampion.club_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="text-center">
                <p className="font-bold text-lg">{overallChampion.club_name}</p>
                <p className="text-sm text-gray-600">
                  Championships: {overallChampion.championships} | Total Points:{" "}
                  {overallChampion.total_points}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats?.sports_winners.map((sport) => (
          <div
            key={sport.sport_id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-blue-50 p-4">
              <h3 className="font-bold text-lg mb-1">{sport.sport_name}</h3>
              <p className="text-sm text-gray-600">{sport.tournament_name}</p>
            </div>

            <div className="p-4 border-b">
              <div className="flex items-center gap-4">
                {sport.winner.club_image && (
                  <img
                    src={sport.winner.club_image}
                    alt={sport.winner.club_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{sport.winner.club_name}</p>
                    {isCompleted ? (
                      <FaTrophy className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <FaMedal className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{sport.winner.status}</p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p>Matches: {sport.winner.performance.matches_played}</p>
                  <p>Points: {sport.winner.performance.points}</p>
                </div>
                <div>
                  <p>Wins: {sport.winner.performance.wins}</p>
                  <p>Win Rate: {sport.winner.performance.win_percentage}%</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold mb-2">Team Standings</h4>
              <div className="space-y-2">
                {sport?.team_standings.map((team, index) => (
                  <div
                    key={team.club_id}
                    className={`flex items-center justify-between p-2 rounded ${
                      index === 0 ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {isCompleted ? `#${index + 1}` : "-"}
                      </span>
                      <span className="text-sm">{team.club_name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{team.points}</span> pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
