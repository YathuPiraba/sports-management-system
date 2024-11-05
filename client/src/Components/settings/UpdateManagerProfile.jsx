import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  updateManagerDetailsApi,
  fetchGSDataApi,
  updateMemberDetailsApi,
} from "../../Services/apiServices";
import { fetchUserDetails } from "../../features/authslice";
import { Button } from "antd";

const UpdateManagerProfile = ({
  setIsModalOpen,
  managerDetails,
  fetchManagerDetails,
}) => {
  const user = useSelector((state) => state.auth.userdata);
  const dispatch = useDispatch();
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = user?.userId;
  const role_id = user?.role_id;

  const fetchGsData = async () => {
    try {
      const res = await fetchGSDataApi();
      setDivisions(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching Gs divisions data:", error);
    }
  };

  useEffect(() => {
    fetchGsData();
  }, []);

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
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const hasChanges = Object.keys(formData).some((key) => {
      if (key === "userName" || key === "email")
        return formData[key] !== user[key];
      return formData[key] !== managerDetails[key];
    });

    if (!hasChanges) {
      toast.error("No changes detected");
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;
      if (role_id == 2) {
        response = await updateManagerDetailsApi(userId, formDataToSend);
      } else if (role_id == 3)  {
        response = await updateMemberDetailsApi(userId, formDataToSend);
      }

      fetchManagerDetails();

      await dispatch(fetchUserDetails());

      toast.success(response.data.message);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "relative w-full h-10 px-1 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
  const labelClassName =
    "cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\\u00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent";

  return (
    <div className="w-auto">
      <form onSubmit={handleUpdateProfile} className="mt-0">
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "firstName", label: "First Name" },
            { id: "lastName", label: "Last Name" },
            { id: "userName", label: "Username" },
            { id: "email", label: "Email Address", type: "email" },
            { id: "contactNo", label: "Contact Number" },
            { id: "whatsappNo", label: "WhatsApp Number" },
            { id: "nic", label: "NIC" },
            { id: "date_of_birth", label: "Date of Birth", type: "date" },
          ].map((field) => (
            <div key={field.id} className="relative my-2">
              <input
                id={field.id}
                type={field.type || "text"}
                value={formData[field.id]}
                onChange={handleInputChange}
                name={field.id}
                placeholder={field.label}
                className={inputClassName}
              />
              <label htmlFor={field.id} className={labelClassName}>
                {field.label}
              </label>
            </div>
          ))}

          <div className="relative my-2">
            <label htmlFor="divisionName" className={labelClassName}>
              Division Name
            </label>
            <select
              name="divisionName"
              value={formData.divisionName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.divisionName}>
                  {division.divisionName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative my-3">
          <textarea
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            name="address"
            placeholder="Address"
            className={`${inputClassName} h-20 py-2`}
          />
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
        </div>

        <div className="relative my-2 flex flex-row gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="text-base bg-sky-500 hover:bg-sky-700 w-full px-4 py-2 rounded-md text-white"
          >
            Clear
          </button>
          <Button
            htmlType="submit"
            className="text-base bg-emerald-500 hover:bg-emerald-700 w-full px-4 py-2 rounded-md text-white"
            loading={loading}
            style={{ padding: "10px", height: "40px" }}
          >
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateManagerProfile;
