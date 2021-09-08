import React from 'react';
import {
    Link
} from "react-router-dom";
import './Sidebar.css';

const Sidebar = ({ setAuth, username, name }) => {

    let loggedIn = username ? true : false;

    const logout = async () => {
        localStorage.removeItem("token");
        setAuth(false);
    }

    return (
        <div className='sidebar'>
            <div className='container'>
                <form>
                    {loggedIn && <h2 className="sidebar-name">{name}'s</h2>}
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search"
                    />
                    <Link className="link" to="/home">
                        {loggedIn && <h5>Home</h5>}
                        {!loggedIn && <h5>Login!</h5>}
                    </Link>
                    {/* {loggedIn && <Link className="link" to="/notifications">
                        <h5>Notifications</h5>
                    </Link>} */}
                    {loggedIn && <Link className="link" to={username}>
                        <h5>Profile</h5>
                    </Link>}
                    {/* {loggedIn && <Link className="link" to="/settings">
                        <h5>Settings</h5>
                    </Link>} */}
                    {loggedIn && <div className="sidebar-footer">
                        <button onClick={logout} className="btn btn-primary logout-button">
                            Logout
                        </button>
                    </div>}
                </form>

            </div>
        </div>
    );
}

export default Sidebar;