import Cookies from 'js-cookie';
import httpService from './httpService';

export default {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    checkUserExistAndType,
    adminLogin,
};

function checkUserExistAndType(name) {
    return httpService.get(`user/type/${name}`);
}

function getUsers() {
    return httpService.get('user');
}

function getById(userId) {
    return httpService.get(`user/${userId}`);
}
function remove(userId) {
    return httpService.delete(`user/${userId}`);
}

function update(user) {
    return httpService.put(`user/${user._id}`, user);
}

async function adminLogin(userCred) {
    const user = await httpService.post('auth/login', userCred);
    return _handleLogin(user);
}

async function login(user) {
    return _handleLogin(user);
}

async function signup(userCred) {
    const user = await httpService.post('auth/signup', userCred);
    return _handleLogin(user);
}
async function logout() {
    Cookies.remove('user');
    sessionStorage.clear();
}
function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
    Cookies.set('user', JSON.stringify(user));
    return user;
}
