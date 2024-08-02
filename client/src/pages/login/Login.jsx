import React,{useState} from "react";
import "./login.css";
import { Modal, Button } from "antd";
import cover from "../../assets/sample-removebg.png";
import logo from "../../assets/log.png";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAdmin, login } from "../../features/authslice";
// import FbGmailSignin from "../../components/Login/FacebookGoogleLogin";

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Login User
  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginAdmin(data));
      if (loginAdmin.fulfilled.match(result)) {
        const resdata = result.payload;
        dispatch(login(resdata));
        toast.success("Login Successfully!..");
        reset();
        const roleID = resdata.user.role_id;

        if (roleID == 1) {
          navigate("/admin");
        } else if (roleID == 2) {
          navigate("/manager");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <div className="body-container">
      <div className="outter">
        <div className="sep">
          <div className="heading">
            <div className="topic">
              <div className="logo">
                <img src={logo} alt="Club Connect Logo" />
                <h1>Club Connect</h1>
              </div>
              <p>Unite Every Club, Connect Every Player...!</p>
            </div>
            <div className="pic">
              <img src={cover} alt="Cover pic" />
            </div>
          </div>
          <div className="login">
            <h2>Login</h2>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter your username"
                  {...register("userName", { required: true })}
                />
                {errors.username && <span>Username is required</span>}
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                />
                {errors.password && <span>Password is required</span>}
                <div className="forgot-btn">
                  <p>Forgot password?</p>
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
                  Don&apos;t have an account? <a href="#" onClick={showModal}>Sign up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="SignUp">
      <Modal
        title={<div style={{ textAlign: 'center' }}>Sign Up</div>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <div className="signup-options">
          <Button onClick={() => navigate("/signup/manager")} type="primary" block  style={{ width: '150px', margin: '10px auto 0' }} >
            Manager
          </Button>
          <Button onClick={() => navigate("/signup/member")} type="primary" block  style={{ width: '150px', margin: '10px auto 0' }} >
            Member
          </Button>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default Login;
