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

    let profileImg = "https://i.stack.imgur.com/34AD2.jpg"

    // checks if user has a profile picture
    if (currentUser.user_image != null) {
        profileImg = currentUser.user_image;
    }


    // adjust retweet count
    const updatePosts = (post_id) => {
        allPosts.map(post => {
            if (post.post_id === post_id)
                post.post_id = post_id;
            return 1;
        });
        return 1;
    }

    // generate posts
    const generatePosts = () => {
        return (
            allPosts.length !== 0 &&
            allPosts.map((post, i) => {
                return (<Post
                    key={`${post.post_id} + ${i++}`}
                    post={post}
                    currentUser_image={post.user_image}
                    updatePosts={updatePosts}
                    generatePosts={generatePosts}
                />
                );
            })
        )
    }

    useEffect(() => {
        getFeedPosts();
    }, []);

    return (
        <div className='feed'>
            <div className='feed-header'>
                <h3>Home</h3>
            </div>
            <CreatePost
                currentUser_image={profileImg}
                getFeedPosts={getFeedPosts}
            />

            {generatePosts()}

            {/* {allPosts.length !== 0 &&
                allPosts.map((post, i) => {
                    return (<Post
                        key={`${post.post_id} + ${i++}`}
                        post={post}
                        currentUser_image={post.user_image}
                        updatePosts={updatePosts}
                        />
                    );
                })
            } */}
        </div>
    );
}

export default Feed;