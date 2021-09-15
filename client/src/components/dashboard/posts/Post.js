import React, { useEffect, useState } from 'react';
import './Post.css';
import {
    Link
} from "react-router-dom";

// components
import CreateComment from './CreateComment';

const Post = ({ post, updatePosts, generatePosts }) => {

    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [retweetCount, setRetweetCount] = useState(0);
    const [retweeter, setRetweeter] = useState('');

    // get number of likes on the post
    const getLikeCount = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/likeCount", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setLikeCount(parseResponse.rows[0].count);
        } catch (err) {
            console.error(err.message);
        }
    }

    // get number of comments on the post
    const getCommentCount = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/commentCount", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setCommentCount(parseResponse.rows[0].count);
        } catch (err) {
            console.error(err.message);
        }
    }

    // get number of retweets on the post
    const getRetweetCount = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/retweetCount", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setRetweetCount(parseResponse.rows[0].count);
        } catch (err) {
            console.error(err.message);
        }
    }

    // get retweeter's user name
    const getRetweetUserName = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/getUsername/" + post.retweet_user_id, {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setRetweeter(parseResponse.rows[0].user_name);
        } catch (err) {
            console.error(err.message);
        }
    }

    // check if the comment has been liked
    const checkIfPostLiked = async () => {
        try {
            const liked = await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/like", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseLiked = await liked.json();

            if (parseLiked.rows.length > 0) {
                await unlikePost();
            } else {
                await likePost();
            }

            getLikeCount();

        } catch (err) {
            console.error(err.message);
        }
    }

    // like the comment
    const likePost = async () => {
        try {
            await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/like", {
                method: "POST",
                headers: { token: localStorage.token }
            });
        } catch (err) {
            console.error(err.message);
        }
    }

    // unlike the comment
    const unlikePost = async () => {
        try {
            await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/like", {
                method: "DELETE",
                headers: { token: localStorage.token }
            });
        } catch (err) {
            console.error(err.message);
        }
    }

    // check if comment has been retweeted
    const checkIfPostRetweeted = async () => {
        try {
            const retweet = await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/retweet", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseRetweet = await retweet.json();

            if (parseRetweet.rows.length > 0) {
                await unretweetPost();
            } else {
                await retweetPost();
            }

            await updatePosts(post.post_id);
            await generatePosts();
            getRetweetCount();

        } catch (err) {
            console.error(err.message);
        }
    }

    // retweet a post
    const retweetPost = async () => {
        try {
            await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/retweet", {
                method: "POST",
                headers: { token: localStorage.token }
            });
        } catch (err) {
            console.error(err.message);
        }
    }

    // un-retweet a post
    const unretweetPost = async () => {
        try {
            await fetch("http://" + window.location.host + ":5000/dashboard/post/" + post.post_id + "/retweet", {
                method: "DELETE",
                headers: { token: localStorage.token }
            });
        } catch (err) {
            console.error(err.message);
        }
    }

    // uses functions on mount
    useEffect(() => {
        getLikeCount();
        getCommentCount();
        getRetweetCount();
        if (post.retweet_user_id) {
            getRetweetUserName();
        }
    });

    // checks if user has a profile picture
    if (post.user_image == null) {
        post.user_image = "https://i.stack.imgur.com/34AD2.jpg";
    }

    // convert post time to local time, slicing off the day of the week in the beginning, and the timezone at the end
    post.post_time = new Date(post.post_time).toString().slice(4, 21);

    return (
        <div>
            <div className='post'>
                {post.retweet_user_id && <div className="activity-info">
                    <span>{retweeter} Retweeted</span>
                </div>}
                <div className="post-container1">
                    <div className="profile-img-container">
                        <img className="profile-image" src={post.user_image} alt="alt" />
                    </div>
                    <div className="post-content">
                        <div className="user-info">
                            <Link className="link" to={post.username}>
                                <span className="user-name">{post.user_name}</span>
                            </Link>
                            {/*&nbsp; will create whitespace*/}
                            <span className="user-tag">&nbsp;@{post.username} . {post.post_time}</span>
                        </div>
                        <div className='post-body'>
                            <p>{post.post_text}</p>
                        </div>
                        <div className='post-options'>
                            <span className='comment-option'>
                                <CreateComment
                                    post={post}
                                    commentCount={commentCount}
                                    getCommentCount={getCommentCount}
                                />
                            </span>
                            <span className='retweet-option'>
                                <button onClick={checkIfPostRetweeted}>Retweet</button>
                                <p>{retweetCount}</p>
                            </span>
                            <span className='like-option'>
                                <button onClick={checkIfPostLiked}>Like</button>
                                <p>{likeCount}</p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;