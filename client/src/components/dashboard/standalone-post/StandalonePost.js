import React, {useState, useEffect} from 'react';

const StandalonePost = ({ setAuth, getCurrentUser, currentUser }) => {

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <div>
            <p>Post</p>
        </div>
    )
}

export default StandalonePost;