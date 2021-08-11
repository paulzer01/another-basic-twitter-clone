const router = require('express').Router();
const pool = require('../db');
const authorise = require('../middleware/authorise');

/* POSTING */
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

// delete a post
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

router.get('/post', authorise, async (req, res) => {
    try {
        const posts = await pool.query(
            "SELECT u.user_id, u.user_name, p.post_id, p.post_text, p.post_time FROM users AS u INNER JOIN posts AS p ON u.user_id = p.user_id WHERE u.user_id != $1 ORDER BY p.post_time DESC",
            [req.user.id]
        );

        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
    }
});

/* COMMENTING */
// make a comment on a post
router.post('/post/:post_id/comment', authorise, async (req, res) => {
    try {
        const { post_id } = req.params;
        const { comment } = req.body;
        const newComment = await pool.query(
            "INSERT INTO comments (post_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *",
            [post_id, req.user.id, comment]
        );

        res.json(newComment.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// delete a comment
router.delete("/comment/:comment_id", authorise, async (req, res) => {
    try {
        const { comment_id } = req.params;
        const deleteComment = await pool.query(
            "DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 RETURNING *",
            [comment_id, req.user.id]
        );

        if (deleteComment.rows.length === 0) {
            return res.json("You cannot delete this comment.");
        }

        return res.json("Comment deleted.");

    } catch (err) {
        console.error(err.message);
    }
});

/* LIKING */
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
router.delete("/post/:post_id/unlike", authorise, async (req, res) => {
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

/* RETWEETING */
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

/* FOLLOWING */
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

module.exports = router;