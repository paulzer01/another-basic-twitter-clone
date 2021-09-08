import React from 'react';
import './Notifications.css';
import Sidebar from '../Sidebar';

const Notifications = ({setAuth, currentUser}) => {
    return (
        <div id="notifications">
            <Sidebar
                setAuth={setAuth}
                username={currentUser.username}
                name={currentUser.user_name}
            />
        </div>
    );
}

export default Notifications;