import React, { Fragment, useState } from 'react';

const CreateComment = ({ post, commentCount, getCommentCount }) => {

    const [comment, setComment] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        const body = { comment };

        const myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", localStorage.token);

        await fetch("/dashboard/post/" + post.post_id + "/comment", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(body)
        });
        setComment("");
        getCommentCount();
    }

    return (
        <Fragment>
            {/* <!-- Button trigger modal --> */}
            <button type="button" data-bs-toggle="modal" data-bs-target={`#post_id${post.post_id}`}>
                Comment
            </button>
            <p>{commentCount}</p>

            {/* <!-- Modal --> */}
            <div className="modal fade" id={`post_id${post.post_id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div onSubmit={onSubmitForm} className='createPost'>
                                <div className="profile-container">
                                    <img className="profile-image" src={post.user_image} alt="alt" />
                                </div>
                                <form className="post-container">
                                    <textarea
                                        type='text'
                                        placeholder='Toot your reply?'
                                        onChange={e => { setComment(e.target.value); }}
                                        value={comment}
                                    />
                                    <button className="btn btn-primary create-post-button" data-bs-dismiss="modal">Reply</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default CreateComment;