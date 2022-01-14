const bcrypt = require("bcrypt");
const { UserModel } = require("../models/Vase");

const saltRounds = 10;

async function login(email, password) {
  console.log(email, password);
  const user = await UserModel.getByEmail(email);
  console.log(password, user.password);
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return Promise.reject({
      message: "Password or email is not valid",
    });
  delete user.password;
  return user;
}

async function signup(email, name, password) {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("signing up", email, name, password);
  if (!UserModel.checkEmailAvailable(email)) {
    console.log("email exists");
    return Promise.reject({
      message: "Email is already subscribed",
    });
  }
  const createdUser = await UserModel.createUser({
    name,
    email,
    password: hash,
  });
  return createdUser;
}

module.exports = {
  signup,
  login,
};
