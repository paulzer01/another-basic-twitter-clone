const router = require('express').Router();
const pool = require('../db');
const authorise = require('../middleware/authorise');
const bcrypt = require('bcrypt');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////* POSTS */
// create a post
router.post('/post', authorise, async (req, res) => {
    try {
        const { postText } = req.body;
        const newPost = await pool.query(
            "INSERT INTO posts (user_id, post_text) VALUES ($1, $2) RETURNING *",
            [req.user.id, postText]
        );
        // to use later in client side to convert from UTC to local time
        // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
        res.json(newPost.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// delete a post/comment
router.delete("/post/:id", authorise, async (req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query(
            "DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING *",
            [id, req.user.id]
        );

        if (deletePost.rows.length === 0) {
            return res.json("You cannot delete this post.");
        }

        return res.json("Post deleted.");

    } catch (err) {
        console.error(err.message);
    }
});

// get posts
router.get('/feedPosts', authorise, async (req, res) => {
    try {
        const posts = await pool.query(
            "(SELECT u.user_id, r.user_id AS retweet_user_id, u.user_name, u.username, u.user_image, p.post_id, p.post_text, r.retweet_time AS post_time FROM posts AS p INNER JOIN retweets AS r ON p.post_id = r.post_id INNER JOIN users AS u ON u.user_id = p.user_id WHERE p.comment_reference_id IS NULL AND r.user_id != $1) UNION (SELECT u.user_id, NULL, u.user_name, u.username, u.user_image, p.post_id, p.post_text, p.post_time FROM posts AS p INNER JOIN users AS u ON u.user_id = p.user_id WHERE p.comment_reference_id IS NULL) ORDER BY post_time DESC",
            [req.user.id]
        );
res.json(posts.rows);
    } catch (err) {
    console.error(err.message);
}
});


// get your own posts
router.get('/ownPosts', authorise, async (req, res) => {
    try {
        const posts = await pool.query(
            "SELECT u.user_id, u.user_name, u.username, u.user_image, p.post_id, p.post_text, p.post_time FROM users AS u INNER JOIN posts AS p ON u.user_id = p.user_id WHERE (u.user_id = $1) AND (p.comment_reference_id = NULL) ORDER BY p.post_time DESC",
            [req.user.id]
        );
        res.json(posts);
    } catch (err) {
        console.error(err.message);
    }
});

//

////////////////////////////////////////////////////////////////////////////////////////////////////////////////* COMMENTS */
// make a comment on a post
router.post('/post/:post_id/comment', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const { comment } = req.body;
        const newComment = await pool.query(
            "INSERT INTO posts (comment_reference_id, user_id, post_text) VALUES ($1, $2, $3) RETURNING *",
            [post_id, req.user.id, comment]
        );
        res.json(newComment.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// get count of comments on a post
router.get('/post/:post_id/commentCount', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const commentCount = await pool.query(
            "SELECT COUNT(post_id) FROM posts WHERE comment_reference_id = $1",
            [post_id]
        );
        res.json(commentCount);
    } catch (err) {
        console.error(err.message);
    }
});

// get comments
router.get('/post/:post_id/comments', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const comments = await pool.query(
            "SELECT u.user_id, u.user_name, u.username, u.user_image, p.post_id, p.post_text, p.post_time FROM users AS u INNER JOIN posts AS p ON u.user_id = p.user_id WHERE p.comment_reference_id = $1 ORDER BY p.post_time DESC",
            [post_id]
        );
        res.json(comments.rows);
    } catch (err) {
        console.error(err.message);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////* LIKES */
// get a specific like
router.get('/post/:post_id/like', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const like = await pool.query(
            "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
            [req.user.id, post_id]
        );
        res.json(like);
    } catch (err) {
        console.error(err.message);
    }
});

// get number of likes on a post
router.get('/post/:post_id/likeCount', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const likeCount = await pool.query(
            "SELECT COUNT(user_id) FROM likes WHERE post_id = $1",
            [post_id]
        );
        res.json(likeCount);
    } catch (err) {
        console.error(err.message);
    }
})

// get profiles of all who have liked a post
router.get('/post/:post_id/likes/profiles', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const profiles = await pool.query(
            "SELECT u.user_id, u.user_name, u.username, u.user_image FROM users AS u INNER JOIN likes AS l ON u.user_id = l.user_id WHERE l.post_id = $1",
            [post_id]
        );
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
    }
});

// like a post
router.post('/post/:post_id/like', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const newLike = await pool.query(
            "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *",
            [post_id, req.user.id]
        );
        res.json("Post liked.");
    } catch (err) {
        console.error(err.message);
    }
});

// unlike a post
router.delete("/post/:post_id/like", authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const deleteLike = await pool.query(
            "DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *",
            [post_id, req.user.id]
        );

        if (deleteLike.rows.length === 0) {
            return res.json("You cannot unlike.");
        }

        return res.json("Unliked.");
    } catch (err) {
        console.error(err.message);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////* RETWEETS */
// get a specific retweet
router.get('/post/:post_id/retweet', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const like = await pool.query(
            "SELECT * FROM retweets WHERE user_id = $1 AND post_id = $2",
            [req.user.id, post_id]
        );
        res.json(like);
    } catch (err) {
        console.error(err.message);
    }
});

// retweet a post
router.post('/post/:post_id/retweet', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const newRetweet = await pool.query(
            "INSERT INTO retweets (post_id, user_id) VALUES ($1, $2) RETURNING *",
            [post_id, req.user.id]
        );
        res.json("Post retweeted.");
    } catch (err) {
        console.error(err.message);
    }
});

// delete a retweet
router.delete("/post/:post_id/retweet", authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const deleteRetweet = await pool.query(
            "DELETE FROM retweets WHERE post_id = $1 AND user_id = $2 RETURNING *",
            [post_id, req.user.id]
        );
        if (deleteRetweet.rows.length === 0) {
            return res.json("You cannot delete this retweet.");
        }
        return res.json("Retweet deleted.");
    } catch (err) {
        console.error(err.message);
    }
});

// get number of retweets on a post
router.get('/post/:post_id/retweetCount', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const retweetCount = await pool.query(
            "SELECT COUNT(user_id) FROM retweets WHERE post_id = $1",
            [post_id]
        );
        res.json(retweetCount);
    } catch (err) {
        console.error(err.message);
    }
})

// get profiles of all who have retweeted a post
router.get('/post/:post_id/likes/profiles', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const profiles = await pool.query(
            "SELECT u.user_id, u.user_name, u.username, u.user_image, r.post_id, r.retweet_time FROM users AS u INNER JOIN retweets AS r ON u.user_id = l.user_id WHERE r.post_id = $1",
            [post_id]
        );
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////* FOLLOWS */
// follow a user
router.post('/profile/:profile_id/follow', authorise, async (req, res) => {
    try {
        const { profile_id } = req.params;
        const newFollow = await pool.query(
            "INSERT INTO followers (follower_id, user_id) VALUES ($1, $2) RETURNING *",
            [req.user.id, profile_id]
        );
        res.json("User followed.");
    } catch (err) {
        console.error(err.message);
    }
});

// unfollow a user
router.delete("/profile/:profile_id/unfollow", authorise, async (req, res) => {
    try {
        const { profile_id } = req.params;
        const unfollow = await pool.query(
            "DELETE FROM followers WHERE follower_id = $1 AND user_id = $2 RETURNING *",
            [req.user.id, profile_id]
        );

        if (unfollow.rows.length === 0) {
            return res.json("You cannot unfollow this profile.");
        }

        return res.json("User unfollowed.");

    } catch (err) {
        console.error(err.message);
    }
});

// get follower count
router.get("/profile/:profile_id/followerCount", authorise, async (req, res) => {
    try {
        const { profile_id } = req.params;
        const followerCount = await pool.query(
            "SELECT COUNT(follower_id) FROM followers WHERE user_id = $1",
            [profile_id]
        );
        res.json(followerCount);
    } catch (err) {
        console.error(err.message);
    }
});

// get follower profiles
router.get("profile/:profile_id/followerProfiles", authorise, async (req, res) => {
    try {
        const { profile_id } = req.params;
        const profiles = await pool.query(
            "SELECT u.user_id, u.username, u.user_name, u.user_image FROM users AS u INNER JOIN followers AS f ON u.user_id = f.follower_id WHERE u.user_id = $1",
            [profile_id]
        );
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
    }
});

// get following count
router.get("/profile/:profile_id/followingCount", authorise, async (req, res) => {
    try {
        const { profile_id } = req.params;
        const followingCount = await pool.query(
            "SELECT COUNT(follower_id) FROM followers WHERE follower_id = $1",
            [profile_id]
        );
        res.json(followingCount);
    } catch (err) {
        console.error(err.message);
    }
});

// get following profiles
router.get("profile/:profile_id/followingProfiles", authorise, async (req, res) => {
    try {
        const { profile_id } = req.params;
        const profiles = await pool.query(
            "SELECT u.user_id, u.username, u.user_name, u.user_image FROM users AS u INNER JOIN followers AS f ON u.user_id = f.follower_id WHERE f.follower_id = $1",
            [profile_id]
        );
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////* GETTING USER PROFILE */

// get a user's full name, username, date joined and profile image
router.get("/profile/:profile_id", authorise, async (req, res) => {
    try {
        const { profile_id } = req.params;
        const profileInfo = await pool.query(
            "SELECT user_name, username, profile_image, date_joined FROM users WHERE user_id = $1",
            [profile_id]
        );
        return res.json(profileInfo.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get the current user's name, username and profile image
router.get("/currentUser", authorise, async (req, res) => {
    try {
        const currentUser = await pool.query(
            "SELECT user_name, username, user_image FROM users WHERE user_id = $1",
            [req.user.id]
        );
        return res.json(currentUser.rows);
    } catch (err) {
        console.error(err.message);
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////* UPDATING USER INFORMATION */

// edit current user's name
router.put("/currentUser/edit-name", authorise, async (req, res) => {
    try {
        const { name } = req.body;
        const updateName = await pool.query(
            "UPDATE users SET user_name = $1 WHERE user_id = $2 RETURNING *",
            [name, req.user.id]
        );
        res.json("Your name has been changed.");
    } catch (err) {
        console.error(err.message);
    }
});

// edit current user's email
router.put("/currentUser/edit-email", authorise, async (req, res) => {
    try {
        const { email } = req.body;
        const existingEmail = await pool.query(
            "SELECT * FROM users WHERE user_email = $1",
            [email]
        );

        if (existingEmail.rows.length > 0) {
            res.json("This email is already being used.");
        }

        const updateEmail = await pool.query(
            "UPDATE users SET user_email = $1 WHERE user_id = $2 RETURNING *",
            [email, req.user.id]
        );
        res.json("Your email has been changed.");
    } catch (err) {
        console.error(err.message);
    }
});

// edit current user's username
router.put("/currentUser/edit-username", authorise, async (req, res) => {
    try {
        const { username } = req.body;

        const existingUsername = await pool.query(
            "SELECT * FROM users WHERE user_name = $1",
            [username]
        );

        if (existingUsername.rows.length > 0) {
            res.json("This email is already being used.");
        }

        const updateUsername = await pool.query(
            "UPDATE users SET user_username = $1 WHERE user_id = $2 RETURNING *",
            [username, req.user.id]
        );
        res.json("Your username has been changed.");
    } catch (err) {
        console.error(err.message);
    }
});

// edit current user's password
router.put("/currentUser/edit-password", authorise, async (req, res) => {
    try {
        const { password } = req.body;

        // get current user
        const user = await pool.query(
            "SELECT * FROM users WHERE user_email = $1", [email]
        )

        // check if password is correct
        const currentPassword = bcrypt.compare(password, user.rows[0].user_password);

        if (currentPassword) {
            res.json("You cannot update to the same password.");
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatePassword = pool.query(
            "UPDATE users SET user_password = $1 WHERE user_id = $2 RETURNING *",
            [hashedPassword, req.user.id]
        );
        res.json("Password successfully changed.");
    } catch (err) {
        console.error(err.message);
    }
});

// edit current user's description
router.put("/currentUser/edit-description", authorise, async (req, res) => {
    try {
        const { description } = req.body;
        const updateDescription = await pool.query(
            "UPDATE users SET user_description = $1 WHERE user_id = $2 RETURNING *",
            [description, req.user.id]
        );
        res.json("Description successfully updated.");
    } catch (err) {
        console.error(err.message);
    }
});

// edit current user's profile image
router.put("/currentUser/edit-image", authorise, async (req, res) => {
    const { image } = req.body;
    const udpateImage = await pool.query(
        "UPDATE users SET user_image = $1 WHERE user_id = $2",
        [image, req.user.id]
    );
    res.json("Profile picture changed.");
});

// remove current user's profile image
router.delete("/currentUser/remove-image", authorise, async (req, res) => {
    const removeImage = await pool.query(
        "UPDATE users SET user_image = NULL WHERE user_id = $1",
        [req.user.id]
    );
    res.json("Profile picture removed.");
});

module.exports = router;

{/* <p><input type="file"  accept="image/*" name="image" id="file"  onchange="loadFile(event)" style="display: none;"></p>
<p><label for="file" style="cursor: pointer;">Upload Image</label></p>
<p><img id="output" width="200" /></p>

<script>
var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
};
</script> */}