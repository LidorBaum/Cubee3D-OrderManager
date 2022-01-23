const express = require('express');
const Libs = require('../libs');
const { OrderModel } = require('../models/Order');
const { baseURL, env } = require('../config');
const { VaseModel } = require('../models/Vase');
const { FilamentModel } = require('../models/Filament');

const orderRouter = express.Router();

orderRouter.post('/', createOrder);

orderRouter.get('/printTime', getTotalPrintTime);

orderRouter.get('/', getAllOrders);

orderRouter.put('/:orderId([A-Fa-f0-9]{24})', updateStatus);

orderRouter.get('/:orderId([A-Fa-f0-9]{24})', getOrderById);

function responseError(response, errMessage) {
    let status = 500;
    return response.status(status).send(errMessage);
}

async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const orderObj = await OrderModel.getOrderById(orderId);
        const calculatedInfo = {
            totalPrintTime: 0,
            totalWeight: 0,
            totalVases: 0,
            totalColors: [],
            totalPrinted: 0,
        };
        const vasesArray = await VaseModel.getAllVases();
        const filamentsArray = await FilamentModel.getAllFilaments();
        orderObj.selectedVasesArray.forEach(vase => {
            const currentVase = vasesArray.find(vaseObj => {
                return vaseObj._id.equals(vase.vaseId);
            });
            const isUsedFilament =
                calculatedInfo.totalColors.findIndex(fil =>
                    fil._id.equals(vase.filamentId)
                ) !== -1;
            if (!isUsedFilament)
                calculatedInfo.totalColors.push(vase.filamentId);
            calculatedInfo.totalWeight +=
                currentVase.sizes[vase.vaseSize].weight * vase.quantity;
            calculatedInfo.totalPrintTime +=
                currentVase.sizes[vase.vaseSize].printTime * vase.quantity;
            calculatedInfo.totalVases += vase.quantity;
            if (vase.status === 'Ready')
                calculatedInfo.totalPrinted += vase.quantity;
        });
        calculatedInfo.totalPrintTime =
            +calculatedInfo.totalPrintTime.toFixed(2);
        calculatedInfo.totalColors = calculatedInfo.totalColors.length;
        const newObj = { ...orderObj.toObject(), toto: 'toto' };
        res.send({ ...newObj, ...calculatedInfo });
    } catch (err) {
        console.log(err);
        return responseError(res, err.message);
    }
}

async function getTotalPrintTime(req, res) {
    try {
        const { vaseArray } = req.body;
        const result = await OrderModel.getPrintTimeArray(vaseArray);
    } catch (err) {
        console.log(err);
        return responseError(res, err.message);
    }
}

async function updateStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;
        const result = await OrderModel.updateStatus(orderId, newStatus);
        res.send(result);
    } catch (err) {
        console.log(err);
        return responseError(res, err.message);
    }
}

async function createOrder(req, res) {
    try {
        const newOrder = await OrderModel.createOrder(req.body);
        res.send(newOrder);
    } catch (err) {
        console.log(err);
        return responseError(res, err.message);
    }
}

async function getAllOrders(req, res) {
    try {
        const orders = await OrderModel.getAllOrders();
        res.send(orders);
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

module.exports = orderRouter;
