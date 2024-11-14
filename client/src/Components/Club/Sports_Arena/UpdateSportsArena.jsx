import React,{useState} from "react";
import { updateSportsArenaAPI } from "../../../Services/apiServices";
import toast from "react-hot-toast";
import { Button } from "antd";

const UpdateSportsArena = ({
  selectedArena,
  arenaName,
  setArenaName,
  location,
  setLocation,
  address,
  setAddress,
  image,
  setImage,
  fetchClubData,
  popClose,
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArena) {
      toast.error("Please select a sports arena");
      return;
    }

    const formdata = new FormData();
    if (image) {
      formdata.append("image", image);
    }
    formdata.append("location", location);
    formdata.append("name", arenaName);
    formdata.append("address", address);
    setLoading(true);
    try {
      await updateSportsArenaAPI(selectedArena.sports_arena_id, formdata);
      fetchClubData();
      toast.success("Sports Arena updated successfully");
      popClose();
    } catch (error) {
      console.log(error);
      toast.error("Error in updating sports arena");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <form onSubmit={handleUpdateSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="arenaName"
          className="block text-sm font-medium text-gray-700"
        >
          Sports Arena Name:
        </label>
        <input
          type="text"
          id="arenaName"
          value={arenaName}
          onChange={(e) => setArenaName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location:
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Arena Image:
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address:
        </label>
        <textarea
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full bg-blue-500 text-white px-4 py-5 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update Sports Arena
        </Button>
      </div>
    </form>
  );
};

export default UpdateSportsArena;
