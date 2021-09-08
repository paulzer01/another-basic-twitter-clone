import React, {useEffect} from 'react';

//components
import Feed from './Feed';
import Sidebar from './Sidebar';

//styling
import './Home.css';

const Home = ({ setAuth, getCurrentUser, currentUser }) => {

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <div className='home'>
            <Sidebar 
                setAuth={setAuth}
                username={currentUser.username}
                name={currentUser.user_name}
            />
            <Feed 
                currentUser={currentUser}
            />
        </div>
    )
}

export default Home;