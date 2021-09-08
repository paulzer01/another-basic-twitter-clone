import React from 'react';
import './Settings.css';
import Sidebar from '../Sidebar';

const Settings = ({setAuth, currentUser}) => {
    return (
        <div id="settings">
            <Sidebar
                setAuth={setAuth}
                username={currentUser.username}
                name={currentUser.user_name}
            />
        </div>
    );
}

export default Settings;