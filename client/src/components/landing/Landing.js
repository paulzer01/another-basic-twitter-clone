import React from "react";

// components
import Register from './Register';
import Login from './Login';

//styling
import './Landing.css';

function Landing({ setAuth }) {
    return (
        <div className="landing">
            <h1 className='heading'>Welcome to Tooter</h1>
            <Login setAuth={setAuth} />
            <Register setAuth={setAuth} />
        </div>
    );
}

export default Landing;