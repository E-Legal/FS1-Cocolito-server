const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Post = db.Post;
const User = db.User;

module.exports = {
    getAll,
    getById,
    createPost,
    updatePost,
    delete: _delete,
};

async function getAll() {
    return await Post.find();
}

async function getById(id) {
    return await Post.findById(id);
}

async function createPost(req) {
    const post = new Post(req.body)
    const user = await User.findById(req.user.sub);

    post.username = user.username;
    post.user_id = req.user.sub;

    return await post.save();
}

async function updatePost(req, id) {
    const post = await Post.findById(id);
    if (!post) throw 'Post not found';
    if (req.user.sub != post.user_id) throw 'Not allowed';

    console.log(req.body.title);
    let postParam = post;
    postParam.updateDate = Date.now();
    if (req.body.title)
        postParam.title = req.body.title;
    if (req.body.message)
        postParam.message = message;
    Object.assign(post, postParam);
    return await post.save();
}


async function _delete(req, id) {
    const post = await Post.findById(id);
    if (req.user.sub != post.user_id) throw 'Not allowed';
    await Post.findByIdAndRemove(id);
}