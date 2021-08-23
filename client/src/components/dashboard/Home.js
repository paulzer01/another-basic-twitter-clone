import React, {useEffect, useState} from 'react';

//components
import Feed from './Feed';
import Sidebar from './Sidebar';

//styling
import './Home.css';

const Home = ({ setAuth }) => {

    const [currentUser, setCurrentUser] = useState({});

    const getCurrentUser = async () => {
        try {
            const response = await fetch("http://localhost:5000/dashboard/currentUser", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setCurrentUser(parseResponse[0]);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <div className='home'>
            <Sidebar 
                setAuth={setAuth}
            />
            <Feed 
                currentUser={currentUser}
            />
        </div>
    )
}

export default Home;