let express = require('express');
let router = express.Router();

let postService = require('./post.service');

// routes
router.post('/', createPost);
router.get('/', getAll);
router.get('/me', getAllOfMe);
router.get('/user/:id', getAllOfUser)
router.get('/:id', getById);
router.put('/:id', updatePost);
router.delete('/:id', _delete);

module.exports = router;

function createPost(req, res, next) {
    postService.createPost(req)
        .then(task => res.json(task))
        .catch(err => next(err));
}

function getAllOfMe(req, res, next) {
    postService.getAllOfThisUser(req.user.sub)
        .then(barracks => res.json(barracks))
        .catch(err => next(err));
}

function getAllOfUser(req, res, next) {
    postService.getAllOfThisUser(req.param.id)
        .then(barracks => res.json(barracks))
        .catch(err => next(err));
}


function getAll(req, res, next) {
    postService.getAll()
        .then(barracks => res.json(barracks))
        .catch(err => next(err));
}

function getById(req, res, next) {
    postService.getById(req.params.id)
        .then(barrack => barrack ? res.json(barrack) : res.sendStatus(404))
        .catch(err => next(err));
}

function updatePost(req, res, next) {
    postService.updatePost(req, req.params.id)
        .then(barrack => barrack ? res.json(barrack) : res.status(404).send({message: 'Post not found'}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    postService.delete(req, req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}