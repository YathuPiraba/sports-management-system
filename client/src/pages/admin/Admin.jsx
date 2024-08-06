import React from "react";
import { useTheme } from "../../context/ThemeContext";


const Admin = () => {
  const { theme } = useTheme();

  return (
    <div
      className={
        theme === "light" ? "bg-customGreen text-black" : "bg-customDark text-white"
      }
    >
      Admin
    </div>
  );
};

export default Admin;
