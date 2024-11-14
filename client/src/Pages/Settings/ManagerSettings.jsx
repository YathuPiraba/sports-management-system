import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import { Button, Modal, Popconfirm, Image } from "antd";
import { useSingleManagerDetails } from "../../hooks/useSingleManagerData";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/authslice";
import GridLoader from "react-spinners/GridLoader";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { IoIosClose } from "react-icons/io";
import {
  deleteProfileAPI,
  updateManagerDetailsApi,
} from "../../Services/apiServices";
import toast from "react-hot-toast";
import {
  MdPermIdentity,
  MdOutlineDateRange,
  MdPhoneInTalk,
  MdWc,
} from "react-icons/md";
import { CgRename } from "react-icons/cg";
import { FaRegIdCard, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsWhatsapp } from "react-icons/bs";

const ChangePassword = lazy(() =>
  import("../../Components/settings/ChangePassword")
);
const UpdateManagerProfile = lazy(() =>
  import("../../Components/settings/UpdateManagerProfile")
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

const ManagerSettings = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = auth?.userdata;
  const roleID = user?.role_id;
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { theme } = useTheme();
  const [imageLoading, setImageLoading] = useState(false);
  const { managerDetails, loading, refetchManagerDetails } =
    useSingleManagerDetails();
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  // New state for crop functionality
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [showCropModal, setShowCropModal] = useState(false);

  const image = user?.image;

  const showPasswordModal = () => setIsPasswordModalOpen(true);
  const showProfileModal = () => setIsProfileModalOpen(true);
  const handleCancelPassword = () => setIsPasswordModalOpen(false);
  const handleCancelProfile = () => setIsProfileModalOpen(false);
  const fetchDetails = () => dispatch(fetchUserDetails());

  useEffect(() => {
    fetchDetails();
  }, [dispatch]);

  const handleChangePicture = () => {
    fileInputRef.current.click();
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

      canvas.width = 200;
      canvas.height = 200;

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

      const base64Image = canvas.toDataURL("image/jpeg");

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
        await updateManagerDetailsApi(user.userId, formData);
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

  const profileDetails = [
    {
      label: "Full Name",
      value: `${managerDetails.firstName || ""} ${
        managerDetails.lastName || ""
      }`,
      icon: <CgRename size={19} className="mr-4" />,
    },
    {
      label: "Username",
      value: user.userName,
      icon: <MdPermIdentity size={19} className="mr-4" />,
    },
    {
      label: "Gender",
      value: managerDetails.gender || "N/A",
      icon: <MdWc className="mr-5" />,
    },
    {
      label: "Email",
      value: user.email,
      icon: <HiOutlineMail className="mr-5 text-red-500" />,
    },
    {
      label: "Contact No",
      value: managerDetails.contactNo,
      icon: <MdPhoneInTalk className="mr-5" />,
    },
    {
      label: "WhatsApp No",
      value: managerDetails.whatsappNo,
      icon: <BsWhatsapp className="mr-5 text-green-600" />,
    },
    {
      label: "NIC",
      value: managerDetails.nic,
      icon: <FaRegIdCard className="mr-5" />,
    },
    {
      label: "Date of Birth",
      value: managerDetails.date_of_birth,
      icon: <MdOutlineDateRange className="mr-5" />,
    },
    {
      label: "Division Name",
      value: managerDetails.gsDivision?.divisionName,
      icon: <FaBuilding className="mr-5" />,
    },
    {
      label: "Address",
      value: managerDetails.address,
      icon: <FaMapMarkerAlt className="mr-5" />,
    },
  ];

  const cancel = (e) => {
    console.log(e);
    toast.error("Action cancelled");
  };

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
      <div>
        <div className="max-w-screen-xl mx-auto px-4 py-2 font-poppins">
          <h1 className="text-2xl font-bold mb-3">Manager profile</h1>
          <div
            className={`${
              theme === "light"
                ? "bg-white text-black"
                : "bg-gray-300 text-white"
            } rounded-lg shadow-md px-6 py-3`}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="md:mr-8 mb-4 md:mb-0 flex flex-col items-center">
                <Image
                  src={
                    image
                      ? image
                      : "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                  }
                  preview={image ? true : false}
                  alt="User Profile"
                  className="w-44 h-44 rounded-full object-cover mb-3"
                  width={200}
                />
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
              <div className="flex-grow">
                <ul className="space-y-1">
                  {profileDetails?.map((detail, index) => (
                    <li
                      key={index}
                      className="flex flex-col md:flex-row border-b border-gray-200 text-black py-1.5"
                    >
                      <span className="font-medium w-full md:w-1/2 flex items-center">
                        {detail.icon}
                        {detail.label}
                      </span>
                      <span className="w-full pl-[35px] md:pl-0 text-gray-700">
                        : &nbsp; {detail.value || "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

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

            <div className="flex flex-col items-center justify-center md:flex-row lg:flex-row gap-3 mt-4">
              <Button
                onClick={showPasswordModal}
                className="h-10 px-4 text-base bg-emerald-500 text-white hover:bg-emerald-800"
              >
                Change Password
              </Button>
              <Button
                onClick={showProfileModal}
                className="h-10 px-4 text-base bg-blue-500 text-white hover:bg-blue-800"
              >
                Update Profile
              </Button>
            </div>
          </div>
        </div>

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
        <Modal
          title={
            <div className="font-poppins tracking-wide w-full pt-1 mb-2 text-2xl text-gray-600">
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
          <UpdateManagerProfile
            setIsModalOpen={setIsProfileModalOpen}
            user={user}
            fetchDetails={fetchDetails}
            managerDetails={managerDetails}
            fetchManagerDetails={refetchManagerDetails}
          />
        </Modal>
      </div>
    </Suspense>
  );
};

export default ManagerSettings;
