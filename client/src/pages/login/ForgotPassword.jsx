import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const ForgotPassword = ({ isVisible, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Implement password reset logic here
      console.log(data);
      toast.success("Password reset instructions sent to your email.");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to send reset instructions. Please try again.");
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
          }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter your email"
              style={{ marginBottom: "1rem" }}
            />
          )}
        />
        {errors.email && (
          <p style={{ color: "red", marginBottom: "1rem" }}>
            {errors.email.message}
          </p>
        )}

        <Button type="primary" htmlType="submit" block>
          Reset Password
        </Button>
      </form>
    </Modal>
  );
};

export default ForgotPassword;
