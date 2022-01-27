const bcrypt = require('bcrypt');
const { UserModel } = require('../models/User');

const saltRounds = 10;

async function login(name, password) {
    const user = await UserModel.getExistanceAndType(name);
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return Promise.reject({
            message: 'Password or name is not match',
        });
    user.password = undefined;
    return user;
}

async function signup(name, password = null) {
    if (password) {
        const hash = await bcrypt.hash(password, saltRounds);

        const createdUser = await UserModel.createUser({
            name,
            type: 'admin',
            password: hash,
        });
        return createdUser;
    }
    const createdUser = await UserModel.createUser({
        name,
        type: 'customer',
    });
    return createdUser;
}

module.exports = {
    signup,
    login,
};
