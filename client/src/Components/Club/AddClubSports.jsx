import React, { useState, useEffect } from "react";
import {
  getAllSportsAPI,
  getAllSportArenasAPI,
  createClubSportsAPI,
} from "../../Services/apiServices";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { Select } from "antd";
import AddSportsForm from "./AddSportsForm";
import AddArenaForm from "./AddArenaForm";

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

        const allArenas = arenasResponse.data.data;

        // If sportsDetails is empty, show all sports
        // If not empty, show only the remaining sports that aren't in sportsDetails
        const sports =
          sportsDetails.length === 0
            ? sportsResponse.data
            : sportsResponse.data.filter(
                (sport) =>
                  !sportsDetails.some((detail) => detail.sports_id == sport.id)
              );

        // For the first arena select (existing arenas)
        const existingArenas =
          sportsDetails.length === 0
            ? allArenas // Show all arenas if sportsDetails is empty
            : allArenas.filter(
                (
                  arena // Show only arenas that are in sportsDetails
                ) =>
                  sportsDetails.some(
                    (detail) => detail.sports_arena_id === arena.id
                  )
              );

        // For the second arena select (other arenas)
        const otherArenas =
          sportsDetails.length === 0
            ? [] // Don't show any arenas in "other arenas" if sportsDetails is empty
            : allArenas.filter(
                (
                  arena // Show arenas that are not in sportsDetails
                ) =>
                  !sportsDetails.some(
                    (detail) => detail.sports_arena_id === arena.id
                  )
              );

        setData((prev) => ({
          ...prev,
          sports,
          arenas: allArenas,
          filteredSports: sports,
          filteredArenas: otherArenas,
          existingArenas: existingArenas,
        }));
      } catch (error) {
        console.log(error);
        toast.error("Error fetching sports or arenas data");
      }
    };

    fetchData();
  }, [sportsDetails]);

  const handleSportChange = (value) => {
    const isAddingNewSport = value === "new";
    setData((prev) => ({
      ...prev,
      selectedSport: value,
      isAddingNewSport: isAddingNewSport,
      newSportName: isAddingNewSport ? "" : value,
    }));
  };

  // const handleNewSportChange = (value) => {
  //   if (value === "new") {
  //     setData((prev) => ({
  //       ...prev,
  //       isAddingNewSport: true,
  //       newSportName: value,
  //     }));
  //   } else {
  //     setData((prev) => ({
  //       ...prev,
  //       selectedSport: value,
  //       isAddingNewSport: false,
  //       newSportName: value,
  //     }));
  //   }
  // };

  const handleArenaChange = (value) => {
    const selectedArenaData = data.arenas.find((arena) => arena.name === value);

    setData((prev) => ({
      ...prev,
      selectedArena: value,
      selectedArenaClubs: selectedArenaData?.clubs || [],
    }));
  };

  const handleNewArenaChange = (value) => {
    if (value === "new") {
      setData((prev) => ({
        ...prev,
        isAddingNewArena: true,
        newArenaName: value,
        selectedArenaClubs: [],
      }));
    } else {
      const selectedArenaData = data.arenas.find(
        // Changed from filteredArenas to arenas
        (arena) => arena.name === value
      );

      setData((prev) => ({
        ...prev,
        selectedArena: value,
        isAddingNewArena: false,
        newArenaName: value,
        selectedArenaClubs: selectedArenaData?.clubs || [],
      }));
    }
  };

  // const handleAddNewSportChange = (e) => {
  //   setData((prev) => ({
  //     ...prev,
  //     addNewSport: e.target.checked,
  //     selectedSport: "",
  //     newSportName: "",
  //   }));
  // };

  const handleAddNewArenaChange = (e) => {
    setData((prev) => ({
      ...prev,
      addNewArena: e.target.checked,
      selectedArenaClubs: [],
      selectedArena: "",
      newArenaName: "",
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
      const errorMessage =
        error.response?.data?.error || "Error in adding club sport.";
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : "bg-white"
      } p-6 w-1/2 z-50 border absolute text-black top-44 left-64 sm:right-28 sm:top-48 rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Add Club Sports</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                id="sportSelect"
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
        </div>

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
                id="arenaSelect"
                showSearch
                placeholder="Select a Sports Arena"
                optionFilterProp="label"
                onChange={handleArenaChange}
                options={data.existingArenas?.map((arena) => ({
                  value: arena.name,
                  label: arena.name,
                }))}
                className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {data.selectedArenaClubs.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  {Array.from(
                    new Set(
                      data.selectedArenaClubs
                        .filter((c) => c.club_id !== club.id) // Exclude the current club by ID
                        .map((c) => c.club_id) // Only keep unique club IDs
                    )
                  )
                    .map(
                      (uniqueClubId) =>
                        data.selectedArenaClubs.find(
                          (c) => c.club_id === uniqueClubId
                        )?.clubName
                    )
                    .filter(Boolean).length > 0 ? (
                    <>
                      <strong>Other Clubs Playing Here: </strong>
                      {Array.from(
                        new Set(
                          data.selectedArenaClubs
                            .filter((c) => c.club_id !== club.id)
                            .map((c) => c.club_id)
                        )
                      )
                        .map(
                          (uniqueClubId) =>
                            data.selectedArenaClubs.find(
                              (c) => c.club_id === uniqueClubId
                            )?.clubName
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </>
                  ) : null}
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
              <AddArenaForm
                data={data}
                handleNewArenaChange={handleNewArenaChange}
                setData={setData}
                club={club}
              />
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
