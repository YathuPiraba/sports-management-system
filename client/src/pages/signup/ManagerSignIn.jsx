import React, { useState, useEffect } from 'react';

// Dummy data for gs_division dropdown
const divisions = [
  { id: 1, name: 'Division 1' },
  { id: 2, name: 'Division 2' },
  // Add more divisions as needed
];

const ManagerSignIn = () => {
  const [clubDetails, setClubDetails] = useState({
    clubName: '',
    address: '',
    clubHistory: '',
    contactNo: '',
    divisionName: '',
  });

  const [managerDetails, setManagerDetails] = useState({
    userName: '',
    email: '',
    password: '',
    image: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    address: '',
    nic: '',
    contactNo: '',
    whatsappNo: '',
  });

  const handleClubChange = (e) => {
    const { name, value } = e.target;
    setClubDetails({ ...clubDetails, [name]: value });
  };

  const handleManagerChange = (e) => {
    const { name, value } = e.target;
    setManagerDetails({ ...managerDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-6">Club Details</h2>
        <ClubDetails details={clubDetails} handleChange={handleClubChange} />
        
        <h2 className="text-2xl font-bold mt-8 mb-6">Manager Details</h2>
        <ManagerDetails details={managerDetails} handleChange={handleManagerChange} />
        
        <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-2 rounded shadow-md hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

const ClubDetails = ({ details, handleChange }) => (
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
          <option key={division.id} value={division.name}>
            {division.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const ManagerDetails = ({ details, handleChange }) => (
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
        onChange={(e) => handleChange({ target: { name: 'image', value: e.target.files[0] } })}
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
        name="dateOfBirth"
        value={details.dateOfBirth}
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

export default ManagerSignIn;
