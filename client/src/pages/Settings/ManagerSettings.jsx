import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useSingleManagerDetails } from "../../hooks/useSingleManagerData";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/authslice";
import GridLoader from "react-spinners/GridLoader";
import ChangePassword from "../../Components/settings/ChangePassword";
import UpdateManagerProfile from "../../Components/settings/UpdateManagerProfile";

const ManagerSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userdata);
  const roleID = useSelector((state) => state.auth.userdata.role_id);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { theme } = useTheme();
  const { managerDetails, loading, error } = useSingleManagerDetails();

  const image = user.image;
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  const showPasswordModal = () => setIsPasswordModalOpen(true);

  const showProfileModal = () => setIsProfileModalOpen(true);

  const handleCancelPassword = () => setIsPasswordModalOpen(false);

  const handleCancelProfile = () => setIsProfileModalOpen(false);

  const fetchDetails = () => dispatch(fetchUserDetails());

  useEffect(() => {
    fetchDetails();
  }, [dispatch]);
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center w-full h-[75vh]">
          <GridLoader
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#4682B4"
          />
        </div>
      ) : (
        <div className="max-w-screen-xl lg:px-8 lg:py-2 h-auto  font-poppins">
          <div
            className={`overflow-hidden rounded pb-12 mx-auto ${
              theme === "light"
                ? "bg-white text-black"
                : "bg-gray-300 text-white"
            } text-center text-slate-500 border border-blue-100 shadow-md hover:border-blue-300 rounded-md`}
          >
            <figure className="p-6 pb-0">
              <h1 className="text-3xl text-center font-medium py-8 text-cyan-600">
                Manager Profile
              </h1>
              <span
                className="relative inline-flex items-center justify-center rounded-full text-white overflow-hidden"
                style={{ width: 80, height: 80 }}
              >
                <img
                  src={image ? `${baseUrl}/${image}` : logo}
                  alt="User Profile"
                  title="user profile"
                  className="w-full h-full object-cover"
                />
              </span>
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
                <UpdateManagerProfile
                  setIsModalOpen={setIsProfileModalOpen}
                  managerDetails={managerDetails}
                  user={user}
                  fetchDetails={fetchDetails}
                />
              </Modal>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSettings;
