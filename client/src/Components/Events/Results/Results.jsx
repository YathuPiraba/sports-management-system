import React, { useState } from "react";

const MatchResults = () => {
  // Sample data - in real app, this would come from API
  const sports = ["All Sports", "Football", "Basketball", "Cricket", "Tennis"];
  const [selectedSport, setSelectedSport] = useState("All Sports");

  const results = {
    Football: [
      {
        id: 1,
        team1: { name: "Manchester United", score: 3 },
        team2: { name: "Chelsea", score: 1 },
        date: "Nov 10, 2024",
        venue: "Old Trafford",
        winner: "Manchester United",
      },
      {
        id: 2,
        team1: { name: "Liverpool", score: 2 },
        team2: { name: "Arsenal", score: 2 },
        date: "Nov 9, 2024",
        venue: "Anfield",
        winner: "Draw",
      },
    ],
    Basketball: [
      {
        id: 3,
        team1: { name: "Lakers", score: 105 },
        team2: { name: "Warriors", score: 98 },
        date: "Nov 10, 2024",
        venue: "Staples Center",
        winner: "Lakers",
      },
    ],
    Cricket: [
      {
        id: 4,
        team1: { name: "India", score: "287/5" },
        team2: { name: "Australia", score: "283/8" },
        date: "Nov 8, 2024",
        venue: "MCG",
        winner: "India",
      },
    ],
  };

  // Get filtered results based on selected sport
  const getFilteredResults = () => {
    if (selectedSport === "All Sports") {
      return Object.values(results).flat();
    }
    return results[selectedSport] || [];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Sport Selection */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Match Results
          </h1>
          <div className="w-full md:w-64">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Teams
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Venue
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Winner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredResults().map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {result.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {result.team1.name}
                        </span>
                        <span className="text-sm font-medium text-gray-800 mt-1">
                          {result.team2.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {result.team1.score}
                        </span>
                        <span className="text-sm font-medium text-gray-800 mt-1">
                          {result.team2.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {result.venue}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${
                          result.winner === "Draw"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {result.winner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty state */}
            {getFilteredResults().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No results found for {selectedSport}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tournament Winner Section (if applicable) */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Tournament Winner
        </h2>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <img
              src="/api/placeholder/64/64"
              alt="Winner"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Manchester United
            </p>
            <p className="text-sm text-gray-600">Premier League 2024</p>
          </div>
          <div className="ml-auto">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
              Champion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
