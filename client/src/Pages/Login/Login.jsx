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
          navigate("/member/dashboard", { replace: true });
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
              navigate("/member/dashboard", { replace: true });
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
    <Suspense fallback={<div className="bg-customDark">Loading...</div>}>
      <div className="body-container">
        <div className="outter relative">
          {/* {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm z-50">
              <FadeLoader className="ml-1 mt-1" color="skyblue" />
            </div>
          )} */}
          <div className="sep">
            <div className="heading">
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
                <p>Unite Every Club, Connect Every Player...!</p>
              </div>
              <div className="pic">
                <img
                  src="https://res.cloudinary.com/dmonsn0ga/image/upload/v1723798479/sample-removebg_j1e38u.png"
                  alt="Cover pic"
                />
              </div>
            </div>
            <div className="login">
              <h2 className=" ">Login</h2>
              <div>
                <form onSubmit={handleFormSubmit}>
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
                    <Button
                      htmlType="submit"
                      className="loginbtn"
                      loading={loading}
                      style={{ padding: "10px", height: "40px" }}
                    >
                      {" "}
                      Login
                    </Button>
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
    </Suspense>
  );
};

export default Login;
