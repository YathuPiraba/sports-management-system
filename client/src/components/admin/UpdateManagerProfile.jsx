import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateManagerDetailsApi } from "../../Services/apiServices";
import { useSelector } from "react-redux";

const UpdateManagerProfile = ({ setIsModalOpen, managerDetails }) => {
  const user = useSelector((state) => state.auth.userdata);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    contactNo: "",
    whatsappNo: "",
    address: "",
    nic: "",
    date_of_birth: "",
    divisionName: "",
    image: null,
  });

  useEffect(() => {
    if (user && managerDetails) {
      setFormData({
        firstName: managerDetails.firstName || "",
        lastName: managerDetails.lastName || "",
        userName: user.userName || "",
        email: user.email || "",
        contactNo: managerDetails.contactNo || "",
        whatsappNo: managerDetails.whatsappNo || "",
        address: managerDetails.address || "",
        nic: managerDetails.nic || "",
        date_of_birth: managerDetails.date_of_birth || "",
        divisionName: managerDetails.gsDivision?.divisionName || "",
        image: null,
      });
    }
  }, [user, managerDetails]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFormData({
      firstName: managerDetails.firstName || "",
      lastName: managerDetails.lastName || "",
      userName: user.userName || "",
      email: user.email || "",
      contactNo: managerDetails.contactNo || "",
      whatsappNo: managerDetails.whatsappNo || "",
      address: managerDetails.address || "",
      nic: managerDetails.nic || "",
      date_of_birth: managerDetails.date_of_birth || "",
      divisionName: managerDetails.gsDivision?.divisionName || "",
      image: null,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const hasChanges = Object.keys(formData).some((key) => {
      if (key === "image") return formData[key] !== null;
      if (key === "userName" || key === "email")
        return formData[key] !== user[key];
      return formData[key] !== managerDetails[key];
    });

    if (!hasChanges) {
      toast.error("No changes detected");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await updateManagerDetailsApi(
        user.userId,
        formDataToSend
      );
      toast.success(response.data.message);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const inputClassName =
    "relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
  const labelClassName =
    "cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\\u00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent";
  return (
    <div>
      <form>
        <div className="relative my-6">
          <input
            onChange={(e) => setImage(e.target.files[0])}
            id="image"
            type="file"
            name="image"
            className="peer relative w-full rounded border border-slate-200 px-4 py-2.5 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 [&::file-selector-button]:hidden"
          />
          <label htmlFor="image" className={labelClassName}>
            Upload an Image
          </label>
        </div>

        <div className="relative my-6">
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFirstName(e.target.value)}
            name="firstName"
            placeholder="First Name"
            className={inputClassName}
          />
          <label htmlFor="firstName" className={labelClassName}>
            First Name
          </label>
        </div>

        <div className="relative my-6">
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setLastName(e.target.value)}
            name="lastName"
            placeholder="Last Name"
            className={inputClassName}
          />
          <label htmlFor="lastName" className={labelClassName}>
            Last Name
          </label>
        </div>

        <div className="relative my-6">
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={(e) => setUserName(e.target.value)}
            name="userName"
            placeholder="Username"
            className={inputClassName}
          />
          <label htmlFor="userName" className={labelClassName}>
            Username
          </label>
        </div>

        <div className="relative my-6">
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email Address"
            className={inputClassName}
          />
          <label htmlFor="email" className={labelClassName}>
            Email Address
          </label>
        </div>

        <div className="relative my-6">
          <input
            id="contactNo"
            type="tel"
            value={formData.contactNo}
            onChange={(e) => setPhoneNumber(e.target.value)}
            name="contactNo"
            placeholder="contactNo"
            className={inputClassName}
          />
          <label htmlFor="phoneNumber" className={labelClassName}>
            Phone Number
          </label>
        </div>

        <div className="relative my-6">
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setAddress(e.target.value)}
            name="address"
            placeholder="Address"
            className={`${inputClassName} h-20 py-2`}
          />
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
        </div>

        <div className="relative my-6 flex flex-row gap-2">
          <button
            onClick={handleClear}
            className="text-base bg-sky-500 hover:bg-sky-700 w-full px-4 py-2 rounded-md text-white"
          >
            Clear
          </button>
          <button
            onClick={handleUpdateProfile}
            className="text-base bg-emerald-500 hover:bg-emerald-700 w-full px-4 py-2 rounded-md text-white"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateManagerProfile;
