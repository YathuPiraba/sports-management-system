import React, { useState, Suspense, lazy, useEffect } from "react";
import "./login.css";
import { Modal, Button } from "antd";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, fetchUserDetails } from "../../features/authslice";
import { Input, Space } from "antd";
import { FadeLoader, PropagateLoader } from "react-spinners";
import { getAllClubsAPI } from "../../Services/apiServices";
const ForgotPassword = lazy(() =>
  import("../../Components/Login/ForgotPassword")
);
// import FbGmailSignin from "../../components/Login/FacebookGoogleLogin";

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] =
    useState(false);
  const [clubLoading, setClubLoading] = useState(true);

  const [clubs, setClubs] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth.token;
  const loading = auth?.loginLoading;
  const user = auth?.userdata;
  const role_id = user?.role_id;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchAllClubs = async () => {
    setClubLoading(true);
    try {
      const res = await getAllClubsAPI();
      setClubs(res.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setClubLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClubs();
  }, []);

  useEffect(() => {
    console.log({ role_id });

    if (isAuthenticated) {
      switch (role_id) {
        case 1:
          navigate("/admin/dashboard", { replace: true });
          break;
        case 2:
          navigate("/manager/club", { replace: true });
          break;
        case 3:
          navigate("/member/club", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
          break;
      }
    }
  }, []);

  // Login User
  const onSubmit = async (data) => {
    if (isForgotPasswordModalVisible) {
      return;
    }

    try {
      const loginResult = await dispatch(loginAdmin(data));

      if (loginAdmin.fulfilled.match(loginResult)) {
        // Now fetch the user details
        const userDetailsResult = await dispatch(fetchUserDetails());

        if (fetchUserDetails.fulfilled.match(userDetailsResult)) {
          const userDetails = userDetailsResult.payload;

          // Handle role-based navigation
          const roleID = userDetails.role_id;

          switch (roleID) {
            case 1:
              navigate("/admin/dashboard", { replace: true });
              break;
            case 2:
              navigate("/manager/club", { replace: true });
              break;
            case 3:
              navigate("/member/club", { replace: true });
              break;
            default:
              navigate("/", { replace: true });
              break;
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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!isForgotPasswordModalVisible) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="body-container flex">
        <div className=" min-h-screen sep"></div>
        <div className=" min-h-screen cont">
          <div className="outter">
            <div className="login">
              <div className="topic">
                <div className="logo">
                  <img
                    src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1723798132/logo2_qanauk.png"
                    alt="Club Connect Logo"
                  />
                  <h1>
                    <span className="title">C</span>
                    <span className="title3">lub </span>
                    <span className="title1">C</span>
                    <span className="title3">onnect</span>
                  </h1>
                </div>
                <div className="moto">
                  <p>Unite Every Club, Connect Every Player...!</p>
                </div>
              </div>
              <div className="loginform w-4/5">
                <form
                  onSubmit={handleFormSubmit}
                  className="space-y-2 lg:space-y-4 "
                >
                  <input
                    type="text"
                    name="userName"
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    {...register("userName", { required: true })}
                  />
                  {errors.username && <span>Username is required</span>}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    )}
                  />
                  {errors.password && <span>Password is required</span>}
                  <div className="forgot-btn items-center">
                    <span
                      onClick={showForgotPasswordModal}
                      className=" cursor-pointer hover:underline"
                    >
                      Forgot Password?
                    </span>
                    <Button
                      htmlType="submit"
                      className="px-6 text-white py-2 rounded-md bg-transparent loginbtn"
                      loading={loading}
                    >
                      Login
                    </Button>
                  </div>
                </form>
                <ForgotPassword
                  isVisible={isForgotPasswordModalVisible}
                  onClose={handleForgotPasswordCancel}
                />
                <div className="mt-4 text-center">
                  <p className="text-md font-roboto ac ">
                    Don't have an account?{" "}
                    <a
                      href="#"
                      className="text-blue-400 hover:underline text-md ml-3"
                      onClick={showModal}
                    >
                      Sign up
                    </a>
                  </p>
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
              <div className="signup-options flex justify-center">
                {clubLoading ? (
                  <div>
                    <PropagateLoader color="blue" />
                  </div>
                ) : (
                  <>
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
                      disabled={clubs?.length === 0}
                      title={
                        clubs?.length === 0
                          ? "Can't register since no managers are registered"
                          : ""
                      }
                    >
                      Member
                    </Button>
                  </>
                )}
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Login;
