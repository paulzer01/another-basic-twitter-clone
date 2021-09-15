import React, { useState } from 'react';
import './CreatePost.css';

const CreatePost = ({ currentUser_image, getFeedPosts }) => {
    const [postText, setPostText] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", localStorage.token);

            const body = { postText }
            const response = await fetch("/dashboard/post", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            await response.json();
            setPostText("");
            getFeedPosts();

        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div onSubmit={onSubmitForm} className='createPost'>
            <div className="profile-container">
                <img className="profile-image" src={currentUser_image} alt="alt" />
            </div>
            <form className="post-container">
                <textarea
                    type='text'
                    placeholder='What do you want to toot?'
                    onChange={e => { setPostText(e.target.value); }}
                    value={postText}
                />
                <button className="btn btn-primary create-post-button">Toot</button>
            </form>
        </div>
    );
}

export default CreatePost;