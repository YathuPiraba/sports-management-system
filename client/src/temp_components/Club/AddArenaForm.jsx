import React from "react";
import { Select } from "antd";

const AddArenaForm = ({ data, handleNewArenaChange, setData, club }) => {
  return (
    <>
      <label
        htmlFor="newArenaSelect"
        className="block text-sm font-medium text-gray-700 mt-2"
      >
        Select Other Arenas:
      </label>
      <Select
        id="newArenaSelect"
        showSearch
        placeholder="Select a New Arena"
        optionFilterProp="label"
        value={data.newArenaName || undefined}
        onChange={handleNewArenaChange}
        options={[
          { value: "new", label: "Add New Arena" },
          ...data.filteredArenas.map((arena) => ({
            value: arena.name,
            label: arena.name,
          })),
        ]}
        className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />

      {data.selectedArenaClubs.length > 0 && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Other Clubs Playing Here: </strong>
          {data.selectedArenaClubs
            .filter((c) => c.clubName !== club.clubName)
            .map((c) => c.clubName)
            .join(", ")}
        </div>
      )}

      {data.isAddingNewArena && (
        <div className="space-y-2 mt-2">
          <div>
            <label
              htmlFor="arenaName"
              className="block text-sm font-medium text-gray-700"
            >
              Arena Name:
            </label>
            <input
              id="arenaName"
              type="text"
              name="name"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newArenaName: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="arenaLocation"
              className="block text-sm font-medium text-gray-700"
            >
              Arena Location:
            </label>
            <input
              id="arenaLocation"
              type="text"
              name="location"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newArenaLocation: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="arenaAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Arena Address:
            </label>
            <textarea
              id="arenaAddress"
              type="text"
              name="address"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newArenaAddress: e.target.value,
                }))
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="arenaImage"
              className="block text-sm font-medium text-gray-700"
            >
              Arena Image:
            </label>
            <input
              id="arenaImage"
              type="file"
              name="image"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  newArenaImage: e.target.files[0],
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

export default AddArenaForm;
