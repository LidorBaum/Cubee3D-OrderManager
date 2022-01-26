const express = require('express');
const Libs = require('../libs');
const { FilamentModel } = require('../models/Filament');
const { baseURL, env } = require('../config');

const filamentRouter = express.Router();

filamentRouter.post('/', createFilament);

filamentRouter.get('/', getAllFilaments);

filamentRouter.put(
    '/:filamentId([A-Fa-f0-9]{24})/increase',
    increaseFilamentWeight
);

filamentRouter.put(
    '/:filamentId([A-Fa-f0-9]{24})/decrease',
    decreaseFilamentWeight
);

// userRouter.put("/edit/:userId([A-Fa-f0-9]{24})", updateUser);

// userRouter.get("/:userId([A-Fa-f0-9]{24})", getUserById);

filamentRouter.delete('/:filamentId([A-Fa-f0-9]{24})', deleteFilament);

function responseError(response, errMessage) {
    let status = 500;
    return response.status(status).send(errMessage);
}

async function increaseFilamentWeight(req, res) {
    try {
        const { filamentId } = req.params;
        const { weight } = req.body;
        const result = await FilamentModel.increaseWeight(filamentId, weight);
        res.send(result);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function decreaseFilamentWeight(req, res) {
    try {
        const { filamentId } = req.params;
        const { weight } = req.body;
        const result = await FilamentModel.decreaseWeight(filamentId, weight);
        res.send(result);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function deleteFilament(req, res) {
    try {
        const { filamentId } = req.params;
        const result = await FilamentModel.deleteFilamentPermanent(filamentId);
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

async function createFilament(req, res) {
    try {
        const newFilament = await FilamentModel.createFilament(req.body);
        res.send(newFilament);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function getAllFilaments(req, res) {
    try {
        const filaments = await FilamentModel.getAllFilaments();
        res.send(filaments);
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

module.exports = filamentRouter;
