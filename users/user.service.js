const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    updateMember,
    delete: _delete,
    is_admin
};

async function authenticate({email, password}) {
    const user = await User.findOne({email});
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({sub: user.id}, config.secret);
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function is_admin(userid) {
    return Promise.resolve(User.findById(userid).then(user => {
        return user.admin;
    }));
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

    const user = new User();

    user.username = userParam.username;
    user.email = userParam.email;

    //const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }


    // save user
    return await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.password = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    return await user.save();
}

async function updateMember(id) {
    const user = await User.findById(id);
    if (!user) throw 'User not found';
    let userParam = user;


    userParam.member = true;
    Object.assign(user, userParam);
    return await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}