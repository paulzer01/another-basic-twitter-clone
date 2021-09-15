import React, { useEffect, useState } from 'react';
import './UserInfo.css';

import Post from '../posts/Post';

const UserInfo = ({ currentUser, profile }) => {

    const [followerProfiles, setFollowerProfiles] = useState([]);
    const [followingProfiles, setFollowingProfiles] = useState([]);
    const [allPostsRetweets, setPostsRetweets] = useState([]);
    const [followed, setFollowed] = useState(Boolean);

    const getPostsRetweets = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/profile/" + profile.username + "/posts", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setPostsRetweets(parseResponse.rows);
        } catch (err) {
            console.error(err.message);
        }
    }

    if (profile) {
        if (profile.user_image == null) {
            profile.user_image = "https://i.stack.imgur.com/34AD2.jpg";
        }
        profile.date_joined = new Date(profile.date_joined).toString().slice(4, 15);
    }

    const getFollowerProfiles = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/profile/" + profile.username + "/followerProfiles", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setFollowerProfiles(parseResponse.rows)
        } catch (err) {
            console.error(err.message);
        }
    }

    const getFollowingProfiles = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/profile/" + profile.username + "/followingProfiles", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseResponse = await response.json();
            setFollowingProfiles(parseResponse.rows);

        } catch (err) {
            console.error(err.message);
        }
    }

    const checkIfFollowed = async () => {
        try {
            const response = await fetch("http://" + window.location.host + ":5000/dashboard/profile/" + profile.username + "/follow", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseResponse = await response.json();

            if (parseResponse.rows.length > 0) {
                await setFollowed(true);
            } else {
                await setFollowed(false);
            }

        } catch (err) {
            console.error(err.message);
        }
    }

    const followUnfollow = async () => {
        if (followed) {
            await unfollowUser();
        } else {
            await followUser();
        }
        checkIfFollowed();
        getFollowerProfiles();
    }

    const followUser = async () => {
        try {
            await fetch("http://" + window.location.host + ":5000/dashboard/profile/" + profile.username + "/follow", {
                method: "POST",
                headers: { token: localStorage.token }
            });
        } catch (err) {
            console.error(err.message);
        }
    }

    const unfollowUser = async () => {
        try {
            await fetch("http://" + window.location.host + ":5000/dashboard/profile/" + profile.username + "/unfollow", {
                method: "DELETE",
                headers: { token: localStorage.token }
            });
        } catch (err) {
            console.error(err.message);
        }
    }

    // generate posts
    const generatePosts = () => {
        return (
            allPostsRetweets.length !== 0 &&
            allPostsRetweets.map((post, i) => {
                return (<Post
                    key={`${post.post_id} + ${i++}`}
                    post={post}
                    currentUser_image={post.user_image}
                    generatePosts={generatePosts}
                />
                );
            })
        )
    }

    useEffect(() => {
        checkIfFollowed();
        getFollowerProfiles();
        getFollowingProfiles();
        getPostsRetweets();
    }, [profile]);

    return (
        <div id="user-info">
            {profile &&
                <div className="user-info-container">
                    <div className='feed-header'>
                        <h3>{profile.user_name}</h3>
                    </div>
                    <img className="profile-img" src={profile.user_image} alt="alt"></img>
                    <div className="user-info-container-2">
                        {currentUser.username && <div className="follow-row">
                            <h3 className="name">{profile.user_name}</h3>
                            {profile.username == currentUser.username && <button>Edit Profile</button>}
                            {profile.username != currentUser.username && !followed && <button onClick={followUnfollow}>Follow</button>}
                            {profile.username != currentUser.username && followed && <button onClick={followUnfollow}>Following</button>}
                        </div>}
                        <p className="user-username">@{profile.username}</p>
                        <p>Description {profile.description}</p>
                        <p className="user-join-date">Joined {profile.date_joined}</p>
                        <p>{followingProfiles.length} <span className="user-followers">Following</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {followerProfiles.length} <span className="user-followers">Followers</span>
                        </p>
                    </div>
                </div>}
            <hr />
            {!profile && <h1 className="user-not-exist">User does not exist</h1>}
            {generatePosts()}
        </div>
    );
}

export default UserInfo;