const express = require('express');
const router = express.Router();
const userService = require('./user.service');


// routes
router.post('/login', authenticate);
router.post('/register', register);
router.get('/profile', getMe);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/member/:id', member);
router.put('/', update);
router.delete('/', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message: 'Username or password is incorrect'}))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function member(req, res, next) {
    userService.updateMember(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getMe(req, res, next){
    userService.getMe(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    if (userService.is_admin(req.user.sub).then(admin => {
        if (admin == true) {
            userService.update(req.user.sub, req.body)
                .then(user => user ? res.json(user) : res.status(404).send({message: 'Somebody found an error'}))
                .catch(err => next(err));
        } else {
            res.status(401).send({message: 'Make your dream'})
        }
    })) ;
}

function updateAdmin(req, res, next) {

}

function _delete(req, res, next) {
    userService.delete(req.user.sub)
        .then(() => res.json({}))
        .catch(err => next(err));
}