import React from 'react';

//components
import Feed from './Feed';
import Sidebar from './Sidebar';

//styling
import './Home.css';

function Home() {
    return (
        <div className='home'>
            <Sidebar />
            <Feed />
        </div>
    )
}

export default Home;