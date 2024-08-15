import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { updateAdminDetailsApi,updateManagerDetailsApi } from "../../Services/apiServices";

const ChangePassword = ({ setIsModalOpen, userId, roleID }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!currentPassword || !password || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (!passwordsMatch) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("currentPassword", currentPassword);
      let res;
      if (roleID == 1) {
        res = await updateAdminDetailsApi(userId, formData);
      }else if (roleID==2){
        res = await updateManagerDetailsApi(userId, formData);
      }
      toast.success(res.data.message);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.res?.data?.message || "An error occurred");
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
  };

  const getConfirmPasswordClass = () => {
    let baseClass =
      "relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

    if (confirmPassword.length > 0) {
      return passwordsMatch
        ? `${baseClass} border-green-500 focus:border-green-500 hover:border-green-500`
        : `${baseClass} border-red-500 focus:border-red-500 hover:`;
    }

    return baseClass;
  };

  return (
    <div>
      <form>
        <div className="relative my-6">
          <input
            id="current_password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            name="current_password"
            placeholder="Current Password"
            className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="current_password"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Current Password
          </label>
        </div>
        <div className="relative my-6">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            placeholder="New Password"
            className="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            htmlFor="password"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            New Password
          </label>
        </div>
        <div className="relative my-6">
          <input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirm_password"
            placeholder="Confirm Password"
            className={getConfirmPasswordClass()}
          />
          <label
            htmlFor="confirm_password"
            className="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Confirm Password
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
            onClick={handleUpdatePassword}
            className="text-base bg-emerald-500 hover:bg-emerald-700 w-full px-4 py-2 rounded-md text-white"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
