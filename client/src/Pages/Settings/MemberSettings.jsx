import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import { Button, Modal, Popconfirm, Tabs } from "antd";
import {
  deleteProfileAPI,
  updateMemberDetailsApi,
} from "../../Services/apiServices";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../features/authslice";
import GridLoader from "react-spinners/GridLoader";
import toast from "react-hot-toast";
const ChangePassword = lazy(() =>
  import("../../Components/settings/ChangePassword")
);
import {
  MdPermIdentity,
  MdOutlineDateRange,
  MdPhoneInTalk,
} from "react-icons/md";
import { CgRename } from "react-icons/cg";
import {
  FaRegIdCard,
  FaMapMarkerAlt,
  FaBuilding,
  FaRunning,
  FaFutbol,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsWhatsapp } from "react-icons/bs";
import { useMemberDetail } from "../../hooks/useMemberDetail";

const MemberSettings = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const user = auth?.userdata;
  const roleID = user?.role_id;
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  const image = user?.image;

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { memberDetails, loading, refetchMemberDetails } = useMemberDetail();

  const showPasswordModal = () => setIsPasswordModalOpen(true);
  const showProfileModal = () => setIsProfileModalOpen(true);
  const handleCancelPassword = () => setIsPasswordModalOpen(false);
  const handleCancelProfile = () => setIsProfileModalOpen(false);
  const fetchDetails = () => dispatch(fetchUserDetails());
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [dispatch]);

  const handleChangePicture = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      setImageLoading(true);
      try {
        await updateMemberDetailsApi(user.userId, formData);
        toast.success("Profile picture updated successfully");
        fetchDetails();
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
      value: `${memberDetails.firstName || ""} ${memberDetails.lastName || ""}`,
      icon: <CgRename size={19} className="mr-4" />,
    },
    {
      label: "Username",
      value: user.userName,
      icon: <MdPermIdentity size={19} className="mr-4" />,
    },
    {
      label: "Email",
      value: user.email,
      icon: <HiOutlineMail className="mr-5 text-red-500" />,
    },
    {
      label: "Contact No",
      value: memberDetails.contactNo,
      icon: <MdPhoneInTalk className="mr-5" />,
    },
    {
      label: "WhatsApp No",
      value: memberDetails.whatsappNo,
      icon: <BsWhatsapp className="mr-5 text-green-600" />,
    },
    {
      label: "NIC",
      value: memberDetails.nic,
      icon: <FaRegIdCard className="mr-5" />,
    },
    {
      label: "Date of Birth",
      value: memberDetails.date_of_birth,
      icon: <MdOutlineDateRange className="mr-5" />,
    },
    {
      label: "Division Name",
      value: memberDetails.divisionName,
      icon: <FaBuilding className="mr-5" />,
    },
    {
      label: "Address",
      value: memberDetails.address,
      icon: <FaMapMarkerAlt className="mr-5" />,
    },
    {
      label: "Position",
      value: memberDetails.position,
      icon: <FaFutbol className="mr-5" />,
    },
    // Only add experience if it is not null
    ...(memberDetails.experience
      ? [
          {
            label: "Experience",
            value: memberDetails.experience,
            icon: <FaRunning className="mr-5" />, // Sports-related icon for experience
          },
        ]
      : []),
  ];

  const sportDetails = [
    {
      name: "Sports Details",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memberDetails.sports && memberDetails.sports.length > 0 ? (
            memberDetails.sports.map((sport, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg">
                <h3 className="font-semibold text-gray-800">
                  {sport.sport_name}
                </h3>
                <ul className="mt-2 space-y-1">
                  {sport.skills.map((skill, idx) => (
                    <li key={idx} className="text-gray-600">
                      - {skill.skill_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-gray-600">No sports details available</div>
          )}
        </div>
      ),
    },
  ];
  

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
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
      <div className="max-w-screen-xl mx-auto px-4 py-2 font-poppins">
        <h1 className="text-2xl font-bold mb-3">Member Profile</h1>
        <div
          className={`${
            theme === "light" ? "bg-white" : "bg-gray-300 "
          } rounded-lg shadow-md px-8 py-3`}
        >
          {/* Profile Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Picture and Buttons */}
            <div className="md:mr-8 mb-4 md:mb-0 flex flex-col items-center">
              <img
                src={
                  image
                    ? image
                    : "https://res.cloudinary.com/dmonsn0ga/image/upload/v1724127326/zrrgghrkk0qfw3rgmmih.png"
                }
                alt="User Profile"
                className="w-44 h-44 rounded-full object-cover mb-3"
              />
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
                loading={imageLoading}
              >
                Change Picture
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
                  Delete Picture
                </Button>
              </Popconfirm>
            </div>

            {/* Tabs for Personal Details and Sports Details */}
            <div className="flex-grow">
              <Tabs
                defaultActiveKey="1"
                centered
                items={[
                  {
                    key: "1",
                    label: "Personal Details",
                    children: (
                      <>
                        {" "}
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
                              <span className="w-full pl-[35px] md:pl-0 text-gray-700 ">
                                : &nbsp; {detail.value || "N/A"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ),
                  },
                  {
                    key: "2",
                    label: sportDetails[0].name,
                    children: <>{sportDetails[0].content}</>,
                  },
                ]}
                tabBarStyle={{
                  fontFamily: "Poppins, sans-serif",
                  borderBottom: "none",
                  width: "100%",
                }}
                className="customTab"
              />
            </div>
          </div>

          {/* Action Buttons */}
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

        {/* Change Password Modal */}
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
      </div>
    </Suspense>
  );
};

export default MemberSettings;
