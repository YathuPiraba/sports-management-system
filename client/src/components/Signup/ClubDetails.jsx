import React from "react";

const ClubDetails = ({ details, handleChange, divisions }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-gray-700">Club Name</label>
      <input
        type="text"
        name="clubName"
        value={details.clubName}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Address</label>
      <input
        type="text"
        name="clubAddress"
        value={details.clubAddress}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-gray-700">Club History</label>
      <textarea
        name="club_history"
        value={details.club_history}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      ></textarea>
    </div>
    <div>
      <label className="block text-gray-700">Contact Number</label>
      <input
        type="text"
        name="clubContactNo"
        value={details.clubContactNo}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Division Name</label>
      <select
        name="clubDivisionName"
        value={details.clubDivisionName}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      >
        <option value="">Select Division</option>
        {divisions.map((division) => (
          <option key={division.id} value={division.divisionName}>
            {division.divisionName}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ClubDetails;
