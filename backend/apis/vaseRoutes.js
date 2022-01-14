const express = require("express");
const Libs = require("../libs");
const { VaseModel } = require("../models/Vase");
const { baseURL, env } = require("../config");

const vaseRouter = express.Router();

vaseRouter.post("/", createVase);

vaseRouter.get("/", getAllVases);

// userRouter.put("/edit/:userId([A-Fa-f0-9]{24})", updateUser);

// userRouter.get("/:userId([A-Fa-f0-9]{24})", getUserById);

vaseRouter.delete("/:vaseId([A-Fa-f0-9]{24})", deleteVase);

function responseError(response, errMessage) {
  let status = 500;
  return response.status(status).send(errMessage);
}

async function deleteVase(req, res) {
  try {
    const { vaseId } = req.params;
    const result = await VaseModel.deleteVase(vaseId);
    if (result.deletedCount === 0) {
      return responseError(
        res
        // Libs.Errors.EmployeeValidation.EmployeeDoesNotExists
      );
    }
    return res.send();
  } catch (err) {
    return responseError(res, err.message);
  }
}

async function createVase(req, res) {
  try {
    const newVase = await VaseModel.createVase(req.body);
    res.send(newVase);
  } catch (err) {
    console.log(err);
    return responseError(res, err.message);
  }
}


async function getAllVases(req, res) {
  try {
    const vases = await VaseModel.getAllVases();
    res.send(vases);
  } catch (err) {
    return responseError(res, err.message);
  }
}

// async function updateUser(req, res) {
//   try {
//     const newUserObj = await UserModel.updateUser(req.body);
//     res.send(newUserObj);
//   } catch (err) {
//     return responseError(res, err.message);
//   }
// }
// async function getUserById(req, res) {
//   try {
//     const { userId } = req.params;
//     const user = await UserModel.getById(userId);
//     res.send(user);
//   } catch (error) {
//     return response.status(status).send(errMessage);
//   }
// }

module.exports = vaseRouter;
