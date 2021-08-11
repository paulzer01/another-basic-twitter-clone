import React, { useState } from 'react';

const CreatePost = () => {
    const [postText, setPostText] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const myHeaders = new Headers();

            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("token", localStorage.token);

            const body = { postText }
            const response = await fetch("http://localhost:5000/dashboard/post", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(body)
            });

            const parseResponse = await response.json();
            setPostText("");
            console.log(parseResponse);

        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div onSubmit={onSubmitForm} className='createPost'>
            <h2>create post</h2>
            <form>
                <input
                    type='text'
                    placeholder='What do you want to toot?'
                    onChange={e => {setPostText(e.target.value); console.log(postText)}}
                    value={postText} 
                />
                <button>Toot</button>
            </form>
        </div>
    );
}

export default CreatePost;