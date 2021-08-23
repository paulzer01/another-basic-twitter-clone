import React from 'react';
import './Sidebar.css';

const Sidebar = ({ name, setAuth }) => {
    
    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    }

    return (
        <div className='sidebar'>
            <div className='container'>
                <form>
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search Tooter"
                    />
                    <h5>Home</h5>
                    <h5>Notifications</h5>
                    <h5>Profile</h5>
                    <h5>Settings</h5>
                    <button onClick={logout} className="btn btn-primary logout-button">Logout</button>
                </form>
            </div>
        </div>
    );
}

export default Sidebar;