import React from 'react';
import {
    Link
} from "react-router-dom";
import './Sidebar.css';

const Sidebar = ({ name, setAuth }) => {

    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
        document.getElementsByClassName("invisible-logout");
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
                    <Link className="link" to="/home">
                        <h5>Home</h5>
                    </Link>
                    <Link className="link" to="/notifications">
                        <h5>Notifications</h5>
                    </Link>
                    <Link className="link" to="/:profile">
                        <h5>Profile</h5>
                    </Link>
                    <Link className="link" to="/settings">
                        <h5>Settings</h5>
                    </Link>

                    <button onClick={logout} className="btn btn-primary logout-button">
                            Logout
                    </button>
                    <div className="invisible-logout">
                        <Link to="/" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Sidebar;