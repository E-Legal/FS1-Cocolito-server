let config = require('../config.json');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let db = require('../_helpers/db');
let Post = db.Post;
let User = db.User;

module.exports = {
    getAll,
    getById,
    createPost,
    updatePost,
    getAllOfThisUser,
    delete: _delete,
};

async function getAll() {
    return await Post.find();
}

async function getAllOfThisUser(id) {
    console.log(id);
    return await Post.find({user_id: id});
}

async function getById(id) {
    return await Post.findById(id);
}

async function createPost(req) {
    let post = new Post(req.body)
    let user = await User.findById(req.user.sub);

    post.username = user.username;
    post.user_id = req.user.sub;

    return await post.save();
}

async function updatePost(req, id) {
    let post = await Post.findById(id);
    if (!post) throw 'Post not found';
    if (req.user.sub != post.user_id) throw 'Not allowed';

    console.log(req.body.title);
    let postParam = post;
    postParam.updateDate = Date.now();
    if (req.body.title)
        postParam.title = req.body.title;
    if (req.body.message)
        postParam.message = req.body.message;
    Object.assign(post, postParam);
    return await post.save();
}


async function _delete(req, id) {
    let post = await Post.findById(id);
    if (req.user.sub != post.user_id) throw 'Not allowed';
    await Post.findByIdAndRemove(id);
}