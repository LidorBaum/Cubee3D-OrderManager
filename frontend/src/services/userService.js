import httpService from "./httpService";

export default {
  login,
  logout,
  signup,
  getAllUsers,
  getUserById,
  removeUser,
  updateUser,
};

function getAllUsers() {
  return httpService.get("user");
}

function getUserById(userId) {
  return httpService.get(`user/${userId}`);
}
function removeUser(userId) {
  return httpService.delete(`user/${userId}`);
}

function updateUser(userObj) {
  return httpService.put(`user/${userObj._id}`, userObj);
}

async function login(userCred) {
  const user = await httpService.post("auth/login", userCred);
  return _handleLogin(user);
}
async function signup(userCred) {
  const user = await httpService.post("auth/signup", userCred);
  return _handleLogin(user);
}
async function logout() {
  await httpService.post("auth/logout");
  sessionStorage.clear();
}
function _handleLogin(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
  return user;
}
