import React from "react";
import { TbPlayerTrackNext } from "react-icons/tb";

const PersonalDetails = ({ details, handleChange, divisions, onNextStep }) => {
  return (
    <div className="w-auto mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Username", name: "userName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          {
            label: "Confirm Password",
            name: "confirm_password",
            type: "password",
          },
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Date of Birth", name: "date_of_birth", type: "date" },
          { label: "NIC", name: "nic", type: "text" },
          { label: "Division Name", name: "divisionName", type: "select" },
          { label: "Image", name: "image", type: "file" },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}:
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={details[field.name]}
                onChange={handleChange}
                className="w-full p-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.divisionName}>
                    {division.divisionName}
                  </option>
                ))}
              </select>
            ) : field.type === "file" ? (
              <input
                type="file"
                name={field.name}
                onChange={(e) =>
                  handleChange({
                    target: { name: field.name, value: e.target.files[0] },
                  })
                }
                className="w-full p-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={details[field.name]}
                onChange={handleChange}
                className="w-full p-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        ))}

        <div className="mb-4 col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address:
          </label>
          <textarea
            name="address"
            value={details.address}
            onChange={handleChange}
            className="w-full p-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {[
          { label: "Contact Number", name: "contactNo" },
          { label: "WhatsApp Number", name: "whatsappNo" },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}:
            </label>
            <input
              type="text"
              name={field.name}
              value={details[field.name]}
              onChange={handleChange}
              className="w-full p-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            onNextStep();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 lg:py-3 px-2 lg:px-6 rounded-md transition duration-150 ease-in-out"
        >
          <TbPlayerTrackNext size={19} />
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;
