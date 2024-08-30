import React, { useState, useEffect } from "react";
import {
  getAllSportsAPI,
  getAllSportArenasAPI,
  createClubSportsAPI,
} from "../../Services/apiServices";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { Select } from "antd";

const { Option } = Select;

const AddClubSports = ({
  popClose,
  fetchClubData,
  theme,
  club,
  sportsDetails,
}) => {
  const [data, setData] = useState({
    sports: [],
    arenas: [],
    filteredSports: [],
    filteredArenas: [],
    selectedSport: "",
    selectedArena: "",
    newSportName: "",
    newArenaName: "",
    newSportImage: null,
    newArenaImage: null,
    isAddingNewSport: false,
    isAddingNewArena: false,
    selectedArenaClubs: [],
    addNewSport: false,
    addNewArena: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportsResponse = await getAllSportsAPI();
        const arenasResponse = await getAllSportArenasAPI();

        const sports = sportsResponse.data.filter((sport) =>
          sportsDetails.some((detail) => detail.sports_id == sport.id)
        );

        const arenas = arenasResponse.data.data.filter((arena) =>
          sportsDetails.some((detail) => detail.sports_arena_id === arena.id)
        );

        setData((prev) => ({
          ...prev,
          sports,
          arenas,
          filteredSports: sportsResponse.data.filter(
            (sport) =>
              !sportsDetails.some((detail) => detail.sports_id == sport.id)
          ),
          filteredArenas: arenasResponse.data.data.filter(
            (arena) =>
              !sportsDetails.some(
                (detail) => detail.sports_arena_id === arena.id
              )
          ),
        }));
      } catch (error) {
        console.log(error);
        toast.error("Error fetching sports or arenas data");
      }
    };

    fetchData();
  }, [sportsDetails]);

  const handleSportChange = (value) => {
    // Determine if we're adding a new sport or selecting an existing one
    const isAddingNewSport = value === "new";

    setData((prev) => ({
      ...prev,
      selectedSport: value,
      isAddingNewSport: isAddingNewSport,
      newSportName: isAddingNewSport ? "" : value,
    }));
  };

  const handleArenaChange = (value) => {
    const selectedArenaData = data.arenas.find((arena) => arena.name === value);

    setData((prev) => ({
      ...prev,
      selectedArena: value,
      selectedArenaClubs: selectedArenaData?.clubs || [],
    }));
  };

  const handleAddNewSportChange = (e) => {
    setData((prev) => ({
      ...prev,
      addNewSport: e.target.checked,
    }));
  };

  const handleAddNewArenaChange = (e) => {
    setData((prev) => ({
      ...prev,
      addNewArena: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("clubName", club.clubName);

    if (data.isAddingNewSport) {
      formData.append("newSport", "true");
      formData.append("newSportName", data.newSportName);
      formData.append("sportType", data.newSportType);
      formData.append("sportDescription", data.newSportDescription);
      if (data.newSportImage) {
        formData.append("sportImage", data.newSportImage);
      }
    } else {
      formData.append("sportsName", data.selectedSport);
    }

    if (data.isAddingNewArena) {
      formData.append("newArena", "true");
      formData.append("newArenaName", data.newArenaName);
      formData.append("arenaLocation", data.newArenaLocation);
      formData.append("arenaAddress", data.newArenaAddress);
      if (data.newArenaImage) {
        formData.append("arenaImage", data.newArenaImage);
      }
    } else {
      formData.append("sportsArenaName", data.selectedArena);
    }

    try {
      await createClubSportsAPI(formData);
      fetchClubData();
      toast.success("Club Sport added successfully");
      popClose();
    } catch (error) {
      console.log(error);
      toast.error("Error in adding club sport");
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : "bg-white"
      } p-6 w-1/2 z-50 border absolute text-black top-44 left-64 rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Add Club Sports</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Sports Select */}
        <div>
          {!data.addNewSport && (
            <>
              <label
                htmlFor="sportSelect"
                className="block text-sm font-medium text-gray-700"
              >
                Select Sport:
              </label>
              <Select
                showSearch
                placeholder="Select a Sport"
                optionFilterProp="label"
                onChange={handleSportChange}
                options={data.sports.map((sport) => ({
                  value: sport.name,
                  label: sport.name,
                }))}
                className="mt-1 block w-full px-0 py-0 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </>
          )}
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={data.addNewSport}
                onChange={handleAddNewSportChange}
                className="form-checkbox"
              />
              <span className="ml-2">Add New Sport</span>
            </label>
            {data.addNewSport && (
              <>
                <label
                  htmlFor="sportSelect"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Other Sports:
                </label>
                <Select
                  showSearch
                  placeholder="Select a Sport"
                  optionFilterProp="label"
                  value={data.newSportName}
                  onChange={(value) => {
                    if (value === "new") {
                      setData((prev) => ({
                        ...prev,
                        isAddingNewSport: true,
                        newSportName: value,
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        selectedSport: value,
                        isAddingNewSport: false,
                        newSportName: value,
                      }));
                    }
                  }}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <Option value="">Select New Sport</Option>
                  {data.filteredSports.map((sport) => (
                    <Option key={sport.id} value={sport.name}>
                      {sport.name}
                    </Option>
                  ))}
                  <Option value="new">Add New Sport</Option>
                </Select>

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
            )}
          </div>
        </div>

        {/* Arena Select */}
        <div>
          {!data.addNewArena && (
            <>
              <label
                htmlFor="arenaSelect"
                className="block text-sm font-medium text-gray-700"
              >
                Select Sports Arena:
              </label>
              <Select
                showSearch
                placeholder="Select a Sports Arena"
                optionFilterProp="label"
                value={data.selectedArena}
                onChange={(value) => {
                  if (value === "new") {
                    setData((prev) => ({
                      ...prev,
                      isAddingNewArena: true,
                      newArenaName: value,
                    }));
                  } else {
                    handleArenaChange(value);
                    setData((prev) => ({
                      ...prev,
                      selectedArena: value,
                      isAddingNewArena: false,
                      newArenaName: value,
                    }));
                  }
                }}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <Option value="">Select a Sports Arena</Option>
                {data.arenas.map((arena) => (
                  <Option key={arena.id} value={arena.name}>
                    {arena.name}
                  </Option>
                ))}
                <Option value="new">Add New Arena</Option>
              </Select>
              {data.selectedArenaClubs.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  <strong>Other Clubs Playing Here: </strong>
                  {data.selectedArenaClubs
                    .filter((c) => c.clubName !== club.clubName)
                    .map((c) => c.clubName)
                    .join(", ")}
                </div>
              )}
            </>
          )}
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={data.addNewArena}
                onChange={handleAddNewArenaChange}
                className="form-checkbox"
              />
              <span className="ml-2">Add New Arena</span>
            </label>
            {data.addNewArena && (
              <>
                <label
                  htmlFor="newArenaSelect"
                  className="block text-sm font-medium text-gray-700 mt-2"
                >
                  Select Other Arenas:
                </label>
                <Select
                  showSearch
                  placeholder="Select a New Arena"
                  optionFilterProp="label"
                  value={data.newArenaName}
                  onChange={(value) => {
                    if (value === "new") {
                      setData((prev) => ({
                        ...prev,
                        isAddingNewArena: true,
                        newArenaName: value,
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        selectedArena: value,
                        isAddingNewArena: false,
                        newArenaName: value,
                      }));
                    }
                  }}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <Option value="">Select New Arena</Option>
                  {data.filteredArenas.map((arena) => (
                    <Option key={arena.id} value={arena.name}>
                      {arena.name}
                    </Option>
                  ))}
                  <Option value="new">Add New Arena</Option>
                </Select>
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
                      <input
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
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Club Sport
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClubSports;
