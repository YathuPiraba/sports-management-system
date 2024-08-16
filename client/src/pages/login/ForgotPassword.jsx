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
  const [otp, setOtp] = useState(null);
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
      setStep(2);
      startTimer();
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.log(error);
    }
  };

  const verifyOTP = async (data) => {
    try {
      const formData = new FormData();
      formData.append("otp", data.otp);
      formData.append("email", email);

      await verifyOtpAPI(formData);
      setOtp(data.otp)
      toast.success("OTP verified successfully.");
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const resetPassword = async (data) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);
      formData.append('password', data.password);
  
      await resetPasswordAPI(formData);
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
            autocomplete="off"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your email"
                  style={{ marginBottom: "1rem" }}
                  autoComplete="off"
                />
              )}
            />
            <Button type="primary" htmlType="submit" block>
              Send OTP
            </Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleSubmit(verifyOTP)}>
            <Controller
              name="otp"
              control={control}
              rules={{ required: "OTP is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter OTP"
                  style={{ marginBottom: "1rem" }}
                />
              )}
            />
            {errors.otp && (
              <p style={{ color: "red", marginBottom: "1rem" }}>
                {errors.otp.message}
              </p>
            )}
            <p>
              Time remaining: {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? "0" : ""}
              {timer % 60}
            </p>
            <Space>
              <Button type="primary" htmlType="submit">
                Verify OTP
              </Button>
              <Button onClick={() => sendOTP(email)} disabled={isTimerRunning}>
                Send OTP Again
              </Button>
            </Space>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit(resetPassword)}>
            <Controller
              name="password"
              control={control}
              rules={{ required: "New password is required" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Enter new password"
                  style={{ marginBottom: "1rem" }}
                />
              )}
            />
            {errors.password && (
              <p style={{ color: "red", marginBottom: "1rem" }}>
                {errors.password.message}
              </p>
            )}
            <Button type="primary" htmlType="submit" block>
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
