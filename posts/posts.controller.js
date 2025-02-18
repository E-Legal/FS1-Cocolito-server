const express = require('express');

const router = express.Router();

const postService = require('./post.service');

function createPost(req, res, next) {
  postService.createPost(req)
    .then((task) => res.json(task))
    .catch((err) => next(err));
}

function getAllOfMe(req, res, next) {
  postService.getAllOfThisUser(req.user.sub)
    .then((barracks) => res.json(barracks))
    .catch((err) => next(err));
}

function getAllOfUser(req, res, next) {
  postService.getAllOfThisUser(req.params.id)
    .then((barracks) => res.json(barracks))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  postService.getAll()
    .then((barracks) => res.json(barracks))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  postService.getById(req.params.id)
    .then((barrack) => (barrack ? res.json(barrack) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function updatePost(req, res, next) {
  postService.updatePost(req, req.params.id)
    .then((barrack) => (barrack ? res.json(barrack) : res.status(404).send({ message: 'Post not found' })))
    .catch((err) => next(err));
}

function deleteThis(req, res, next) {
  postService.delete(req, req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

// routes
router.post('/', createPost);
router.get('/', getAll);
router.get('/user/:id', getAllOfUser);
router.get('/me', getAllOfMe);
router.get('/:id', getById);
router.put('/:id', updatePost);
router.delete('/:id', deleteThis);

module.exports = router;
