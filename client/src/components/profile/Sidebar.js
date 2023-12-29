import React, { useState, useEffect, useContext } from "react";
import "../../styles/App.css";
import { FaUser, FaListAlt, FaSignOutAlt, FaTimes, FaBars } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

const Sidebar = ({ onButtonClick }) => {
  // const sidebarClasses = `sidebar fixed left-0 top-0 h-screen w-60 text-black transition-width`;
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const sidebarClasses = `transition duration-500 dark:text-white sidebar fixed left-0 top-0 h-screen w-60 text-black transform transition-transform ${
    isSidebarVisible ? "translate-x-0 transition-transform duration-300 ease-in" : "-translate-x-full transition-transform duration-300 ease-out"
  }`;
  useEffect(() => {
    // Check screen width and set initial sidebar visibility
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setSidebarVisible(screenWidth >= 640); // Adjust the breakpoint as needed
    };

    handleResize(); // Set initial state

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("expenseTrackerUserJWTToken");
    localStorage.removeItem("expenseTrackerUserFirebaseRefId");
    window.location.href = "/";
  };
  const { theme } = useContext(ThemeContext);
  const dynamicStyle = {
    backgroundColor: theme === "dark" ? "#011019" : "#EAF0FB"
  };
  return (
    <>
      <div className="z-10">
      <FaBars onClick={toggleSidebar} className='mx-4 my-7 text-3xl absolute cursor-pointer sm:hidden block'/>
      <div className={sidebarClasses} style={dynamicStyle}>
        <div className='buttons p-4 mt-36  '>
          <FaTimes className='absolute top-4 right-4 text-3xl cursor-pointer sm:hidden block' onClick={toggleSidebar}/>
          <button className='flex items-center mb-8' onClick={() => onButtonClick("profile")}>
            <FaUser className='mr-2 ' />
            Profile
          </button>
          <button className='flex items-center mb-8' onClick={() => onButtonClick("predefinedTransactions")}>
            <FaListAlt className='mr-2' />
            Predefined Transactions
          </button>
          <button className='flex items-center mb-8' onClick={handleLogOut}>
            <FaSignOutAlt className='mr-2' />
            Logout
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
