import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';

import Sidebar from '../Sidebar';
import UserInfo from './UserInfo';

const Profile = ({ setAuth, getCurrentUser, currentUser }) => {

    const [profile, setProfile] = useState({});
    const { username } = useParams();

    const getProfile = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/profile/" + username, {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setProfile(parseResponse[0]);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getCurrentUser();
        getProfile();
    }, []);

    return (
        <div className="profile">
            <Sidebar
                setAuth={setAuth}
                username={currentUser.username}
                name={currentUser.user_name}
            />
            <UserInfo
                currentUser={currentUser}
                profile={profile}
            />
        </div>
    )
}

export default Profile;