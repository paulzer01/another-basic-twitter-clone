CREATE DATABASE twitterclone;

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE users (
    user_id UUID DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (user_id)
);

-- FOLLOWERS
CREATE TABLE followers (
    user_id UUID NOT NULL,
    follower_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id),
    PRIMARY KEY (user_id, follower_id)
);

-- POSTS
CREATE TABLE posts (
    post_id SERIAL NOT NULL,
    user_id UUID NOT NULL,
    post_text TEXT NOT NULL,
    post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (post_id)
);

-- COMMENTS
CREATE TABLE comments (
    comment_id SERIAL,
    post_id INT NOT NULL,
    user_id UUID NOT NULL,
    comment_text TEXT NOT NULL,
    comment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (comment_id)
);

-- LIKES (each user can only like each post once)
CREATE TABLE likes (
    post_id INT NOT NULL,
    user_id UUID NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (post_id, user_id)
);

-- RETWEET (each user can only retweet each post once)
CREATE TABLE retweets (
    post_id INT NOT NULL,
    user_id UUID NOT NULL,
    retweet_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (post_id, user_id)
);


