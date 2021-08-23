import React, { useState, useEffect } from 'react';

//components
import CreatePost from './posts/CreatePost';
import Post from './posts/Post';

//styling
import './Feed.css';

const Feed = ({ currentUser }) => {

    const [allPosts, setAllPosts] = useState([]);

    const getFeedPosts = async () => {
        try {
            const response = await fetch("http://localhost:5000/dashboard/feedPosts", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setAllPosts(parseResponse);
        } catch (err) {
            console.error(err.message);
        }
    }

    // checks if user has a profile picture
    if (currentUser.user_image == null) {
        currentUser.user_image = "https://i.stack.imgur.com/34AD2.jpg";
    }

    useEffect(() => {
        getFeedPosts();
    }, []);

    return (
        <div className='feed'>
            <div className='feed-header'>
                <h3>Hello, {currentUser.user_name}</h3>
            </div>
            <CreatePost
                currentUser_image={currentUser.user_image}
                getFeedPosts={getFeedPosts}
            />

            {allPosts.length !== 0 &&
                allPosts.map((post, i) => {
                    return (<Post
                        key={`${post.post_id} + ${i++}`}
                        post={post}
                        currentUser_image={post.user_image}
                        />
                    );
                })
            }
        </div>
    );
}

export default Feed;