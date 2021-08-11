import React from 'react';

//components
import CreatePost from './posts/CreatePost';
import Post from './posts/Post';

//styling
import './Feed.css';

const Feed = () => {
    return (
        <div className='feed'>
            <CreatePost />
            <Post />
        </div>
    );
}

export default Feed;