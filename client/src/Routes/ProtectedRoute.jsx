import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import echo from "../utils/echo";
import { logOutAdmin } from "../features/authslice";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth.token;
  const authenticate = auth.userdata;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  useEffect(() => {
    if (isAuthenticated) {
      const channel = echo.channel("deactivate");

      // Listen for real-time updates
      channel.listen(".user-deactivate", (event) => {
        console.log("New user applied:", event.userId);

        if (authenticate.userId === event.userId) {
          toast.error(
            "Sorry, your account has been deactivated. Please contact your Club Manager."
          );
          navigate("/login");
          dispatch(logOutAdmin());
        }
      });

      channel.subscribed(() => {
        console.log("Subscribed to the deactivate channel");
      });

      channel.error((error) => {
        console.error("Subscription error:", error);
      });

      return () => {
        echo.leaveChannel("deactivate");
      };
    }
  }, [isAuthenticated, authenticate?.userId, navigate, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login"  />;
  }

  const isVerified = authenticate?.is_verified;

  if (isVerified === 0) {
    return <Navigate to="/home" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
