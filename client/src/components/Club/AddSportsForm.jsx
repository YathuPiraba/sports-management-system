import React from "react";
import { Select } from "antd";

const AddSportsForm = ({ data, handleNewSportChange, setData }) => {
  return (
    <>
      <label
        htmlFor="newsportSelect"
        className="block text-sm font-medium text-gray-700"
      >
        Select Other Sports:
      </label>
      <Select
        id="newsportSelect"
        showSearch
        placeholder="Select a Sport"
        optionFilterProp="label"
        value={data.newSportName || undefined}
        onChange={handleNewSportChange}
        options={[
          ...data.filteredSports.map((sport) => ({
            value: sport.name,
            label: sport.name,
          })),
          { value: "new", label: "Add New Sport" },
        ]}
        className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />

      {data.isAddingNewSport && (
        <div className="space-y-2">
          <div>
            <label
              htmlFor="sportName"
              className="block text-sm font-medium text-gray-700"
            >
              Sport Name:
            </label>
            <input
              id="sportName"
              type="text"
              name="name"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newSportName: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="sportType"
              className="block text-sm font-medium text-gray-700"
            >
              Sport Type:
            </label>
            <select
              id="sportType"
              name="type"
              value={data.newSportType || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newSportType: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled>
                Select sport type
              </option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="sportDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Sport Description:
            </label>
            <textarea
              id="sportDescription"
              name="description"
              value={data.newSportDescription || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newSportDescription: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="sportImage"
              className="block text-sm font-medium text-gray-700"
            >
              Sport Image:
            </label>
            <input
              id="sportImage"
              type="file"
              name="image"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newSportImage: e.target.files[0],
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AddSportsForm;
