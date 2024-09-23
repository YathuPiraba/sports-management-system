import React, { useState } from "react";
import { updateClubDetailsApi } from "../../Services/apiServices";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import useGsDivisions from "../../hooks/useGsDivisions";

const UpdateClub = ({ club, popClose, fetchClubData, theme }) => {
  const { divisions } = useGsDivisions();
  const [clubName, setClubName] = useState(club.clubName || "");
  const [clubDivisionName, setClubDivisionName] = useState(
    club.clubDivisionName || ""
  );
  const [clubAddress, setClubAddress] = useState(club.clubAddress || "");
  const [clubHistory, setClubHistory] = useState(club.club_history || "");
  const [clubContactNo, setClubContactNo] = useState(club.clubContactNo || "");
  const [clubImage, setClubImage] = useState(null);

  const handleImageChange = (e) => {
    setClubImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (clubImage) {
      formData.append("clubImage", clubImage);
    }
    formData.append("clubName", clubName);
    if (clubDivisionName) {
      formData.append("clubDivisionName", clubDivisionName);
    }
    formData.append("clubAddress", clubAddress);
    formData.append("club_history", clubHistory);
    formData.append("clubContactNo", clubContactNo);

    try {
      await updateClubDetailsApi(club.id, formData);
      fetchClubData();
      toast.success("Club updated successfully");
      popClose();
    } catch (error) {
      console.error(error);
      toast.error("Error in updating club");
    }
  };

  return (
    <div
      className={`${
        theme === "light" ? "bg-gray-100" : " bg-white"
      } p-6 text-black w-1/2 z-50 border absolute top-20 left-60 sm:right-20 sm:top-48  rounded-lg shadow-lg max-w-md mx-auto`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold font-poppins">Update Club</h1>
        <button onClick={popClose} className="text-red-500">
          <MdClose size={25} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="clubName"
            className="block text-sm font-medium text-gray-700"
          >
            Club Name:
          </label>
          <input
            type="text"
            id="clubName"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="clubDivisionName"
            className="block text-sm font-medium text-gray-700"
          >
            Club Division:
          </label>
          <select
            id="clubDivisionName"
            value={clubDivisionName}
            onChange={(e) => setClubDivisionName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <label
            htmlFor="clubAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Club Address:
          </label>
          <textarea
            type="text"
            id="clubAddress"
            value={clubAddress}
            onChange={(e) => setClubAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="clubHistory"
            className="block text-sm font-medium text-gray-700"
          >
            Club History:
          </label>
          <textarea
            id="clubHistory"
            value={clubHistory}
            onChange={(e) => setClubHistory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="clubContactNo"
            className="block text-sm font-medium text-gray-700"
          >
            Club Contact Number:
          </label>
          <input
            type="text"
            id="clubContactNo"
            value={clubContactNo}
            onChange={(e) => setClubContactNo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="clubImage"
            className="block text-sm font-medium text-gray-700"
          >
            Club Image:
          </label>
          <input
            type="file"
            id="clubImage"
            name="clubImage"
            onChange={handleImageChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Club
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateClub;
