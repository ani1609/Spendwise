import React, { useState } from "react";
import Sidebar from "./Sidebar";
import RightDashboard from "./RightDashboard";
import PredefinedTransactions from "./PredefinedTransactions";

const Profile = () => {
  const [content, setContent] = useState("profile");

  const handleButtonClick = (selectedContent) => {
    setContent(selectedContent);
  };
  return (
    <div className='profile-container flex'>
      <Sidebar onButtonClick={handleButtonClick} />
      {content === "profile" && <RightDashboard />}
      {content === "predefinedTransactions" && <PredefinedTransactions />}
    </div>
  );
};

export default Profile;
