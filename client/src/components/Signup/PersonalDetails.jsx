import React from "react";


const PersonalDetails = ({ details, handleChange, divisions, onNextStep }) => {

  return (
    <>
      <h1 className="mx-2 mb-1 text-xl font-poppins font-bold underline text-center">
        Personal Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center">
        <div className="mb-2 mx-auto p-1">
          <label className="block text-gray-700">Username :</label>
          <input
            type="text"
            name="userName"
            value={details.userName}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">Email :</label>
          <input
            type="email"
            name="email"
            value={details.email}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">Password :</label>
          <input
            type="password"
            name="password"
            value={details.password}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700"> Confirm Password :</label>
          <input
            type="password"
            name="confirm_password"
            onChange={handleChange}
            value={details.confirm_password}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">First Name :</label>
          <input
            type="text"
            name="firstName"
            value={details.firstName}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">Last Name :</label>
          <input
            type="text"
            name="lastName"
            value={details.lastName}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">Date of Birth :</label>
          <input
            type="date"
            name="date_of_birth"
            value={details.date_of_birth}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">Division Name :</label>
          <select
            name="divisionName"
            value={details.divisionName}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.divisionName}>
                {division.divisionName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">Image :</label>
          <input
            type="file"
            name="image"
            onChange={(e) =>
              handleChange({
                target: { name: "image", value: e.target.files[0] },
              })
            }
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>
        <div className="mb-2 mx-auto">
          <label className="block text-gray-700">Address :</label>
          <textarea
            name="address"
            value={details.address}
            onChange={handleChange}
            className="mt-1 p-1 w-72 border rounded"
          />
        </div>

        <div className="md:col-span-2 flex flex-row mx-auto gap-6">
          <div>
            <label className="block text-gray-700">NIC :</label>
            <input
              type="text"
              name="nic"
              value={details.nic}
              onChange={handleChange}
              className="mt-1 p-1 w-56 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Contact Number :</label>
            <input
              type="text"
              name="contactNo"
              value={details.contactNo}
              onChange={handleChange}
              className="mt-1 p-1 w-56 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">WhatsApp Number :</label>
            <input
              type="text"
              name="whatsappNo"
              value={details.whatsappNo}
              onChange={handleChange}
              className="mt-1 p-1 w-56 border rounded"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-3 ml-4">
        <button
          onClick={onNextStep}
          className="bg-blue-500 text-white px-2 py-1 border rounded-md"
        >
          continue
        </button>
      </div>
    </>
  );
};

export default PersonalDetails;
