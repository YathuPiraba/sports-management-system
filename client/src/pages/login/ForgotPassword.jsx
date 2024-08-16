import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import {
  forgotPasswordAPI,
  resetPasswordAPI,
  verifyOtpAPI,
} from "../../Services/apiServices";

const ForgotPassword = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      toast.error("OTP has expired. Please request a new one.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startTimer = () => {
    setTimer(600);
    setIsTimerRunning(true);
  };

  const sendOTP = async (email) => {
    try {
      await forgotPasswordAPI({ email: email });
      toast.success("OTP sent to your email.");
      setEmail(email);
      reset();
      setStep(2);
      startTimer();
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.log(error);
    }
  };

  const verifyOTP = async (data) => {
    try {
      const payload = {
        email: email,
        otp: data.otp,
      };

      await verifyOtpAPI(payload);
      setOtp(data.otp);
      toast.success("OTP verified successfully.");
      reset();
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const resetPassword = async (data) => {
    try {
      const payload = {
        email: email,
        otp: otp,
        password: data.password,
        password_confirmation: data.confirm_password,
      };

      console.log(otp);

      await resetPasswordAPI(payload);
      toast.success("Password reset successfully.");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form
            onSubmit={handleSubmit((data) => sendOTP(data.email))}
            className="space-y-2"
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  placeholder="Enter your email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  autoComplete="off"
                />
              )}
            />
            <Button
              type="primary"
              htmlType="submit"
              block
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Send OTP
            </Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleSubmit(verifyOTP)} className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP:
            </label>
            <Controller
              name="otp"
              control={control}
              rules={{ required: "OTP is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="otp"
                  placeholder="Enter OTP"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.otp && (
              <p className="text-red-600 text-sm mb-2">{errors.otp.message}</p>
            )}
            <p className="text-gray-600">
              Time remaining: {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? "0" : ""}
              {timer % 60}
            </p>
            <div className="flex space-x-2">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md"
              >
                Verify OTP
              </Button>
              <Button
                onClick={() => sendOTP(email)}
                className="w-full bg-gray-500 text-white py-2 rounded-md"
              >
                Send OTP Again
              </Button>
            </div>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit(resetPassword)} className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password:
            </label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "New password is required" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  id="password"
                  placeholder="Enter new password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password:
            </label>
            <Controller
              name="confirm_password"
              control={control}
              rules={{ required: "Confirm password is required" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  id="confirm_password"
                  placeholder="Confirm your new password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mb-2">
                {errors.password.message}
              </p>
            )}
            <Button
              type="primary"
              htmlType="submit"
              block
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Reset Password
            </Button>
          </form>
        );
    }
  };

  return (
    <Modal
      title="Forgot Password"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      {renderStep()}
    </Modal>
  );
};

export default ForgotPassword;
