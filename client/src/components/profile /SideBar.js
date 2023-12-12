import React from 'react';
import "../../styles/App.css";
import { FaUser, FaListAlt, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ isMouseOver }) => {
  const sidebarClasses = `sidebar ${isMouseOver ? 'open' : ''} fixed left-0 top-0 h-screen w-60 text-black transition-width`;

  return (
    <div className={sidebarClasses} style={{ backgroundColor: '#EAF0FB' }}>
      
      <div className="buttons p-4 mt-36  ">
        <button className="flex items-center mb-8 ">
          <FaUser className="mr-2 " />
          Profile
        </button>
        <button className="flex items-center mb-8">
          <FaListAlt className="mr-2" />
          Predefined Transactions
        </button>
        <button className="flex items-center mb-8">
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
