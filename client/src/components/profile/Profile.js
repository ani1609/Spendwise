import React from 'react';
import Sidebar from './Sidebar'; 
import RightDashboard from './RightDashboard'; 

const Profile = () => {
    return (
        <div className="profile-container">
            <Sidebar/>
            <RightDashboard/>

        </div>
    );
}

export default Profile;
