import React from 'react'
import { useTheme } from "../../context/ThemeContext"
import "./Admin.css"

const Admin = () => {
  const { theme } = useTheme();
  const themeClass = theme === 'light' ? 'add1' : 'add2';
  return (
    
    <div className={themeClass}>Admin</div>
  )
}

export default Admin