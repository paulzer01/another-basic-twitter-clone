import React from 'react';
import './Profile.css';

import Sidebar from '../Sidebar';
import UserInfo from './UserInfo';

const Profile = ({ setAuth }) => {
    return (
        <div className="profile">
            <Sidebar />
            <UserInfo />
        </div>
    )
}

export default Profile;