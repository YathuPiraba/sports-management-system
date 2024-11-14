import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/authslice";
import { useTheme } from "../../context/ThemeContext";
import { Button, Modal, Popconfirm, Image } from "antd";
import { IoIosClose } from "react-icons/io";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import toast from "react-hot-toast";
import {
  deleteProfileAPI,
  updateAdminDetailsApi,
} from "../../Services/apiServices";
import { GridLoader } from "react-spinners";

const UpdateProfile = lazy(() =>
  import("../../Components/settings/UpdateProfile")
);
const ChangePassword = lazy(() =>
  import("../../Components/settings/ChangePassword")
);

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const AdminSettings = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = auth?.userdata;
  const roleID = user?.role_id;
  const loading = auth?.loading;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  // New state for crop functionality
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [showCropModal, setShowCropModal] = useState(false);

  const image = user?.image;

  const handleChangePicture = () => {
    fileInputRef.current.click();
  };

  const cancel = (e) => {
    console.log(e);
    toast.error("Action cancelled");
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  const handleCropComplete = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const base64Image = canvas.toDataURL("image/jpeg", 0.9);

      // Convert base64 to blob
      const res = await fetch(base64Image);
      const blob = await res.blob();
      const file = new File([blob], "profile-image.jpg", {
        type: "image/jpeg",
      });

      // Upload cropped image
      const formData = new FormData();
      formData.append("image", file);
      setImageLoading(true);

      try {
        await updateAdminDetailsApi(user.userId, formData);
        toast.success("Profile picture updated successfully");
        fetchDetails();
        setShowCropModal(false);
      } catch (error) {
        toast.error("Failed to update profile picture");
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleDeletePicture = async () => {
    try {
      await deleteProfileAPI(user.userId);
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[75vh]">
        <GridLoader
          loading={loading}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#4682B4"
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <div className="max-w-screen-xl lg:px-8 lg:py-2 h-auto font-poppins">
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
              <div className="flex flex-col items-center md:flex-row lg:flex-row justify-center gap-3">
                <span
                  className="relative inline-flex items-center justify-center rounded-full text-white overflow-hidden"
                 
                >
                  <Image
                    src={
                      image
                        ? image
                        : "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                    }
                    preview={image ? true : false}
                    alt="User Profile"
                    title="user profile"
                    className="w-full h-full object-cover"
                    width={150}
                  />
                </span>
                <div className="w-28 mt-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onSelectFile}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <Button
                    onClick={handleChangePicture}
                    className="bg-indigo-900 text-white mb-2 w-full py-1"
                    loading={imageLoading}
                  >
                    Change picture
                  </Button>

                  <Popconfirm
                    title="Deleting Profile"
                    description="Are you sure you want to delete this Profile?"
                    onConfirm={handleDeletePicture}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="border border-gray-300 w-full py-1"
                      disabled={!image}
                    >
                      Delete picture
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </figure>

            {/* Crop Modal */}
            {showCropModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 w-[500px] mx-auto relative">
                  <button
                    onClick={() => {
                      setShowCropModal(false);
                      setImgSrc("");
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <IoIosClose size={24} />
                  </button>

                  <h3 className="text-lg font-medium mb-4">
                    Crop Profile Image
                  </h3>

                  <div className="max-h-[400px] overflow-auto">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      aspect={1}
                      circularCrop
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="max-w-full"
                      />
                    </ReactCrop>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowCropModal(false);
                        setImgSrc("");
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <Button
                      loading={imageLoading}
                      onClick={() => handleCropComplete(crop)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              <header className="mb-4">
                <h3 className="text-xl font-medium text-slate-700">
                  {user.userName}
                </h3>
                <p className="text-slate-400">{user.email}</p>
              </header>
            </div>
            <div className="flex justify-center flex-col items-center md:flex-row lg:flex-row gap-2 p-6 pt-0">
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
                maskClosable={false}
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
                maskClosable={false}
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
