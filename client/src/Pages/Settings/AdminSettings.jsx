import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/authslice";
import { useTheme } from "../../context/ThemeContext";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";
import { updateAdminDetailsApi } from "../../Services/apiServices";
import Avatar from "../../assets/default-avatar-profile.png";

const UpdateProfile = lazy(() =>
  import("../../Components/settings/UpdateProfile")
);
const ChangePassword = lazy(() =>
  import("../../Components/settings/ChangePassword")
);

const AdminSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userdata);
  const roleID = useSelector((state) => state.auth.userdata.role_id);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { theme } = useTheme();
  const fileInputRef = useRef(null);

  const image = user.image;

  const handleChangePicture = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        await updateAdminDetailsApi(user.userId, formData);
        toast.success("Profile picture updated successfully");
        fetchDetails();
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    }
  };

  const handleDeletePicture = async () => {
    try {
      // Fetch the image using its path
      const response = await fetch(Avatar);

      // Convert the image response to a Blob
      const blob = await response.blob();

      // Create a FormData object and append the Blob
      const formData = new FormData();
      formData.append("image", blob, "default-avatar-profile.png");

      await updateAdminDetailsApi(user.userId, formData);
      toast.success("Profile picture deleted successfully");
      fetchDetails();
    } catch (error) {
      toast.error("Failed to delete profile picture");
      console.error("Error deleting profile picture:", error);
    }
  };

  const showPasswordModal = () => setIsPasswordModalOpen(true);

  const showProfileModal = () => setIsProfileModalOpen(true);

  const handleCancelPassword = () => setIsPasswordModalOpen(false);

  const handleCancelProfile = () => setIsProfileModalOpen(false);

  const fetchDetails = () => dispatch(fetchUserDetails());

  useEffect(() => {
    fetchDetails();
  }, [dispatch]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <div className="max-w-screen-xl lg:px-8 lg:py-2 h-auto  font-poppins">
          <div
            className={`overflow-hidden rounded pb-12 mx-auto ${
              theme === "light"
                ? "bg-white text-black"
                : "bg-gray-300 text-white"
            } text-center text-slate-500 border border-blue-100 shadow-md hover:border-blue-300 rounded-md`}
          >
            <figure className="p-6 pb-0">
              <h1 className="text-3xl text-center font-medium py-4 text-cyan-600">
                Admin Profile
              </h1>
              <div className="flex justify-center gap-3 ml-28">
                <span
                  className="relative inline-flex items-center justify-center rounded-full text-white overflow-hidden"
                  style={{ width: 100, height: 100 }}
                >
                  <img
                    src={image}
                    alt="User Profile"
                    title="user profile"
                    className="w-full h-full object-cover"
                  />
                </span>
                <div className="w-28 mt-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <Button
                    onClick={handleChangePicture}
                    className="bg-indigo-900 text-white mb-2 w-full py-1"
                  >
                    Change picture
                  </Button>
                  <Button
                    onClick={handleDeletePicture}
                    className="border border-gray-300 w-full py-1"
                  >
                    Delete picture
                  </Button>
                </div>
              </div>
            </figure>

            <div className="p-6">
              <header className="mb-4">
                <h3 className="text-xl font-medium text-slate-700">
                  {user.userName}
                </h3>
                <p className="text-slate-400">{user.email}</p>
              </header>
            </div>
            <div className="flex justify-center gap-2 p-6 pt-0">
              <Button
                onClick={showPasswordModal}
                className="h-10 px-5 w-40 bg-emerald-500 text-base text-white hover:bg-emerald-800"
              >
                Change Password
              </Button>
              <Modal
                title={
                  <div className="font-poppins tracking-wide pt-6 text-2xl text-gray-600">
                    Change Password
                  </div>
                }
                style={{ textAlign: "center" }}
                open={isPasswordModalOpen}
                onCancel={handleCancelPassword}
                footer={null}
                className="lg:mr-72"
              >
                <ChangePassword
                  setIsModalOpen={setIsPasswordModalOpen}
                  userId={user.userId}
                  roleID={roleID}
                />
              </Modal>
              <Button
                onClick={showProfileModal}
                className="h-10 px-5 w-40 bg-blue-500 text-base text-white hover:bg-emerald-800"
              >
                Update Profile
              </Button>
              <Modal
                title={
                  <div className="font-poppins tracking-wide pt-6 text-2xl text-gray-600">
                    Update Profile
                  </div>
                }
                style={{ textAlign: "center" }}
                open={isProfileModalOpen}
                onCancel={handleCancelProfile}
                footer={null}
                className="lg:mr-72"
              >
                <UpdateProfile
                  setIsModalOpen={setIsProfileModalOpen}
                  user={user}
                  fetchDetails={fetchDetails}
                />
              </Modal>
            </div>
          </div>
        </div>
      </>
    </Suspense>
  );
};

export default AdminSettings;