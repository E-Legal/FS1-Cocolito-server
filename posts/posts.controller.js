const express = require('express');
const router = express.Router();

const barrackService = require('./post.service');

// routes
router.post('/', createPost);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', updatePost);
router.delete('/:id', _delete);

module.exports = router;

function createPost(req, res, next) {
    barrackService.createPost(req)
        .then(task => res.json(task))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    barrackService.getAll()
        .then(barracks => res.json(barracks))
        .catch(err => next(err));
}

function getById(req, res, next) {
    barrackService.getById(req.params.id)
        .then(barrack => barrack ? res.json(barrack) : res.sendStatus(404))
        .catch(err => next(err));
}

function updatePost(req, res, next) {
    barrackService.updatePost(req, req.params.id)
        .then(barrack => barrack ? res.json(barrack) : res.status(404).send({message: 'Post not found'}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    barrackService.delete(req, req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}