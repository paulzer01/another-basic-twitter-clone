CREATE DATABASE twitterclone;

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE users (
    user_id UUID DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    date_joined DATE DEFAULT CURRENT_DATE,
    user_description VARCHAR(255),
    user_image BYTEA,
    PRIMARY KEY (user_id)
);

-- FOLLOWERS
CREATE TABLE followers (
    user_id UUID NOT NULL,
    follower_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, follower_id)
);

-- POSTS/COMMENTS
CREATE TABLE posts (
    post_id SERIAL NOT NULL,
    comment_reference_id INT DEFAULT NULL,
    user_id UUID NOT NULL,
    post_text TEXT NOT NULL,
    post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_reference_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id)
);

-- RETWEET (each user can only retweet each post once)
CREATE TABLE retweets (
    post_id INT NOT NULL,
    user_id UUID NOT NULL,
    retweet_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

-- LIKES (each user can only like each post once)
CREATE TABLE likes (
    post_id INT NOT NULL,
    user_id UUID NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

-------------------------------------- QUERIES -------------------------------------

-- get all posts and retweets sorted by time posted (of original post), then retweet time (so all retweets are under the original post)
(SELECT u.user_id, r.user_id AS retweet_user_id, u.user_name, u.username, u.user_image, p.post_id, p.post_text, p.post_time, r.retweet_time 
FROM posts AS p
INNER JOIN retweets AS r
ON p.post_id = r.post_id
INNER JOIN users AS u
ON u.user_id = p.user_id
WHERE p.comment_reference_id IS NULL)
UNION
(SELECT u.user_id, NULL, u.user_name, u.username, u.user_image, p.post_id, p.post_text, p.post_time, NULL
FROM posts AS p 
INNER JOIN users AS u
ON u.user_id = p.user_id
WHERE p.comment_reference_id IS NULL)
ORDER BY post_time, retweet_time DESC;

-- get all posts and retweets sorted by time posted/retweeted
(SELECT u.user_id, r.user_id AS retweet_user_id, u.user_name, u.username, u.user_image, p.post_id, p.post_text, r.retweet_time AS post_time
FROM posts AS p
INNER JOIN retweets AS r
ON p.post_id = r.post_id
INNER JOIN users AS u
ON u.user_id = p.user_id
WHERE p.comment_reference_id IS NULL)
UNION
(SELECT u.user_id, NULL, u.user_name, u.username, u.user_image, p.post_id, p.post_text, p.post_time
FROM posts AS p
INNER JOIN users AS u
ON u.user_id = p.user_id
WHERE p.comment_reference_id IS NULL)
ORDER BY post_time DESC;

-- get all posts sorted by post time
SELECT u.user_id, u.user_name, u.username, u.user_image, p.post_id, p.post_text, p.post_time 
FROM users AS u INNER JOIN posts AS p ON u.user_id = p.user_id WHERE (p.comment_reference_id IS NULL) ORDER BY p.post_time DESC

-- get all follower profiles
SELECT users.username
FROM users
INNER JOIN followers
ON users.user_id = followers.follower_id
WHERE followers.user_id = (SELECT user_id FROM users WHERE username = 'madara');


