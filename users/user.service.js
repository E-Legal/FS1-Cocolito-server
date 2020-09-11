let config = require('../config.json');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let db = require('../_helpers/db');
let User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    updateMember,
    getMe
};

async function authenticate({email, password}) {
    let user = await User.findOne({email});
    if (user && bcrypt.compareSync(password, user.password)) {
        let token = jwt.sign({sub: user.id}, config.secret);
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getMe(userid) {
    return await User.findById(userid);
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    if (await User.findOne({email: userParam.email})) {
        throw 'Username "' + userParam.email + '" is already used';
    }

    let user = new User();

    user.username = userParam.username;
    user.email = userParam.email;

    // hash password
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }


    // save user
    return await user.save();
}

async function update(id, {password}) {
    let user = await User.findById(id);

    if (!user) throw 'User not found';
    let userParam = user;

    if (password) {
        userParam.password = bcrypt.hashSync(password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    return await user.save();
}

async function updateMember(id) {
    let user = await User.findById(id);
    if (!user) throw 'User not found';
    let userParam = user;


    userParam.member = true;
    Object.assign(user, userParam);
    return await user.save();
}