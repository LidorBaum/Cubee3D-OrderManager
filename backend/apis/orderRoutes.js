const express = require('express');
const Libs = require('../libs');
const { OrderModel } = require('../models/Order');
const { baseURL, env } = require('../config');

const orderRouter = express.Router();

orderRouter.post('/', createOrder);

orderRouter.get('/printTime', getTotalPrintTime);

orderRouter.get('/', getAllOrders);

orderRouter.put('/:orderId([A-Fa-f0-9]{24})', updateStatus);

orderRouter.get("/:orderId([A-Fa-f0-9]{24})", getOrderById);

function responseError(response, errMessage) {
    let status = 500;
    return response.status(status).send(errMessage);
}

async function getOrderById(req, res){
    try{
        const {orderId} = req.params
        const orderObj = await OrderModel.getOrderById(orderId)
        res.send(orderObj)
    }catch(err){
        console.log(err);
        return responseError(res, err.message); 
    }
}

async function getTotalPrintTime(req,res){
    try{
        const {vaseArray} = req.body
        const result = await OrderModel.getPrintTimeArray(vaseArray)
        
    }catch(err){
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
