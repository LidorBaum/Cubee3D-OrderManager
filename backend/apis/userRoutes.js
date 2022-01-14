const express = require("express");
const Libs = require("../libs");
const { UserModel } = require("../models/Vase");
const { baseURL, env } = require("../config");

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getAllUsers);

userRouter.put("/edit/:userId([A-Fa-f0-9]{24})", updateUser);

userRouter.get("/:userId([A-Fa-f0-9]{24})", getUserById);

userRouter.delete("/:userId([A-Fa-f0-9]{24})", deleteUser);

function responseError(response, errMessage) {
  let status = 500;
  return response.status(status).send(errMessage);
}

async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    const result = await UserModel.deleteUser(userId);
    if (result.deletedCount === 0) {
      return responseError(
        res,
        Libs.Errors.EmployeeValidation.EmployeeDoesNotExists
      );
    }
    return res.send();
  } catch (err) {
    return responseError(res, err.message);
  }
}

async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await UserModel.getById(userId);
    res.send(user);
  } catch (error) {
    return response.status(status).send(errMessage);
  }
}
async function createUser(req, res) {
  try {
    const newUser = await UserModel.createUser(req.body);
    res.send(newUser);
  } catch (err) {
    console.log(err);
    return responseError(res, err.message);
  }
}

async function updateUser(req, res) {
  try {
    const newUserObj = await UserModel.updateUser(req.body);
    res.send(newUserObj);
  } catch (err) {
    return responseError(res, err.message);
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    res.send(users);
  } catch (err) {
    return responseError(res, err.message);
  }
}

module.exports = userRouter;
