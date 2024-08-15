import React, { useState } from "react";
import "./login.css";
import { Modal, Button } from "antd";
import cover from "../../assets/sample-removebg.png";
import logo from "../../assets/logo2.png";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAdmin, fetchUserDetails } from "../../features/authslice";
import { Input, Space } from "antd";
import ForgotPassword from "./ForgotPassword";
// import FbGmailSignin from "../../components/Login/FacebookGoogleLogin";

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] =
    useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Login User
  const onSubmit = async (data) => {
    try {
      const loginResult = await dispatch(loginAdmin(data));
      if (loginAdmin.fulfilled.match(loginResult)) {
        // Now fetch the user details
        const userDetailsResult = await dispatch(fetchUserDetails());

        if (fetchUserDetails.fulfilled.match(userDetailsResult)) {
          const userDetails = userDetailsResult.payload;

          // Handle role-based navigation
          const roleID = userDetails.role_id;
          const isVerified = userDetails.is_verified;

          if (isVerified === 0) {
            navigate("/home");
          } else {
            if (roleID === 1) {
              navigate("/admin/dashboard");
            } else if (roleID === 2) {
              navigate("/manager/dashboard");
            } else if (roleID === 3) {
              navigate("/member/dashboard");
            } else {
              navigate("/");
            }
          }
          toast.success("Login Successfully!..");
          reset();
        } else {
          toast.error("Failed to retrieve user details. Please try again.");
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.log("error", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(true);
  };

  const handleForgotPasswordCancel = () => {
    setIsForgotPasswordModalVisible(false);
  };

  return (
    <div className="body-container">
      <div className="outter">
        <div className="sep">
          <div className="heading">
            <div className="topic">
              <div className="logo">
                <img src={logo} alt="Club Connect Logo" />
                <h1>
                  <span className="title">C</span>
                  <span className="title3">lub </span>
                  <span className="title1">C</span>
                  <span className="title3">onnect</span>
                </h1>
              </div>
              <p>Unite Every Club, Connect Every Player...!</p>
            </div>
            <div className="pic">
              <img src={cover} alt="Cover pic" />
            </div>
          </div>
          <div className="login">
            <h2 className=" ">Login</h2>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  {...register("userName", { required: true })}
                />
                {errors.username && <span>Username is required</span>}
                <Space direction="vertical">
                  <Space direction="horizontal">
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input.Password
                          {...field}
                          placeholder="Enter your password"
                          visibilityToggle={{
                            visible: passwordVisible,
                            onVisibleChange: setPasswordVisible,
                          }}
                          className="pass"
                        />
                      )}
                    />
                  </Space>
                  {errors.password && <span>Password is required</span>}
                </Space>
                <div className="forgot-btn">
                  <span
                    onClick={showForgotPasswordModal}
                   className="white cursor-pointer forgot mt-2 hover:underline ml-2 "
                  >
                    Forgot Password?
                  </span>
                  <ForgotPassword
                    isVisible={isForgotPasswordModalVisible}
                    onClose={handleForgotPasswordCancel}
                  />
                  <button>Login</button>
                </div>
              </form>

              {/* <div className="intersect">
                <p>_______________</p>
                <p id="or">Or</p>
                <p>_______________</p>
              </div>
              < >
               <FbGmailSignin/>
              </> */}
              <div className="signup">
                <p>
                  Don&apos;t have an account?{" "}
                  <a href="#" onClick={showModal}>
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="SignUp">
        <Modal
          title={<div style={{ textAlign: "center" }}>Sign Up</div>}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={400}
        >
          <div className="signup-options">
            <Button
              onClick={() => navigate("/signup/manager")}
              type="primary"
              block
              style={{ width: "150px", margin: "10px auto 0" }}
            >
              Manager
            </Button>
            <Button
              onClick={() => navigate("/signup/member")}
              type="primary"
              block
              style={{ width: "150px", margin: "10px auto 0" }}
            >
              Member
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Login;
