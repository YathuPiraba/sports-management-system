import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateAdminDetailsApi } from "../../Services/apiServices";
import { Button } from "antd";

const UpdateProfile = ({ setIsModalOpen, user, fetchDetails }) => {
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleClear = (e) => {
    e.preventDefault();
    setUserName(user.userName);
    setEmail(user.email);
    setImage(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (userName === user.userName && email === user.email && !image) {
      toast.error("No changes detected");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (userName !== user.userName) formData.append("userName", userName);
      if (email !== user.email) formData.append("email", email);

      const response = await updateAdminDetailsApi(user.userId, formData);
      toast.success(response.data.message);
      setIsModalOpen(false);
      fetchDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form>
        <div className="relative my-6">
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            name="userName"
            placeholder="Username"
            className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="userName"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Username
          </label>
        </div>

        <div className="relative my-6">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email Address"
            className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="email"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Email Address
          </label>
        </div>

        <div className="relative my-6 flex flex-row gap-2">
          <button
            onClick={handleClear}
            className="text-base bg-sky-500 hover:bg-sky-700 w-full px-4 py-2 rounded-md text-white"
          >
            Clear
          </button>
          <Button
            onClick={handleUpdateProfile}
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

export default UpdateProfile;
