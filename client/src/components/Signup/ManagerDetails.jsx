import React from "react";

const ManagerDetails = ({ details, handleChange, divisions }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-gray-700">Username</label>
      <input
        type="text"
        name="userName"
        value={details.userName}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Email</label>
      <input
        type="email"
        name="email"
        value={details.email}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Password</label>
      <input
        type="password"
        name="password"
        value={details.password}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Image</label>
      <input
        type="file"
        name="image"
        onChange={(e) =>
          handleChange({ target: { name: "image", value: e.target.files[0] } })
        }
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">First Name</label>
      <input
        type="text"
        name="firstName"
        value={details.firstName}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Last Name</label>
      <input
        type="text"
        name="lastName"
        value={details.lastName}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Date of Birth</label>
      <input
        type="date"
        name="date_of_birth"
        value={details.date_of_birth}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div>
      <label className="block text-gray-700">Age</label>
      <input
        type="number"
        name="age"
        value={details.age}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-gray-700">Address</label>
      <input
        type="text"
        name="address"
        value={details.address}
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
    <div>
      <label className="block text-gray-700">NIC</label>
      <input
        type="text"
        name="nic"
        value={details.nic}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
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
      <label className="block text-gray-700">WhatsApp Number</label>
      <input
        type="text"
        name="whatsappNo"
        value={details.whatsappNo}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
      />
    </div>
  </div>
);

export default ManagerDetails;
