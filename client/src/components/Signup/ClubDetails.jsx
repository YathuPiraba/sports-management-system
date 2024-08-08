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
        name="address"
        value={details.address}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-gray-700">Club History</label>
      <textarea
        name="clubHistory"
        value={details.clubHistory}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      ></textarea>
    </div>
    <div>
      <label className="block text-gray-700">Contact Number</label>
      <input
        type="text"
        name="contactNo"
        value={details.contactNo}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Division Name</label>
      <select
        name="divisionName"
        value={details.divisionName}
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
