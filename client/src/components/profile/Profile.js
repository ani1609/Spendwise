import React from 'react';
import Sidebar from './Sidebar'; 
import RightDashboard from './RightDashboard'; 
import PredefinedTransactions from './PredefinedTransactions';

const Profile = () => {
    return (
        <div className="profile-container">
            <Sidebar/>
            {/* <RightDashboard/> */}
            <PredefinedTransactions/>
        </div>
    );
}

export default Profile;
