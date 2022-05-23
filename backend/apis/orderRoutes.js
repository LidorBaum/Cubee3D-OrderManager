const express = require('express');
const Libs = require('../libs');
const { OrderModel } = require('../models/Order');
const { baseURL, env } = require('../config');
const { VaseModel } = require('../models/Vase');
const { FilamentModel } = require('../models/Filament');

const orderRouter = express.Router();

orderRouter.post('/', createOrder);

orderRouter.get('/', getAllOrders);

orderRouter.put(
    '/edit/:orderId([A-Fa-f0-9]{24})/printed',
    updateVasePrintedCount
);

orderRouter.put('/edit/:orderId([A-Fa-f0-9]{24})/vase', updateVaseStatus);

orderRouter.put('/edit/:orderId([A-Fa-f0-9]{24})', updateStatus);

orderRouter.get('/:orderId([A-Fa-f0-9]{24})', getOrderById);

orderRouter.get('/orders/:customerId([A-Fa-f0-9]{24})', getCustomerOrders);

function responseError(response, errMessage) {
    let status = 500;
    return response.status(status).send(errMessage);
}

async function getCustomerOrders(req, res) {
    try {
        const { customerId } = req.params;
        const ordersArr = await OrderModel.getCustomerOrders(customerId);
        const totalVases = ordersArr.reduce((total, order) => {
            return Libs.Utils.getTotalVases(order.selectedVasesArray) + total;
        }, 0);
        res.send({ orders: ordersArr, totalVases: totalVases });
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const orderObj = await OrderModel.getOrderById(orderId);
        const calculatedInfo = {
            vasesArrForDisplay: [],
            totalPrintTime: 0,
            totalWeight: 0,
            totalVases: 0,
            totalColors: [],
            totalPrinted: 0,
        };
        const vasesArray = await VaseModel.getAllVases();
        const filamentsArray = await FilamentModel.getAllFilaments();
        orderObj.selectedVasesArray.forEach(vaseMongoObj => {
            const vase = vaseMongoObj.toObject();
            const currentVase = vasesArray.find(vaseObj => {
                return vaseObj._id.equals(vase.vaseId);
            });
            const currentFil = filamentsArray.find(fil => {
                return fil._id.equals(vase.filamentId);
            });

            calculatedInfo.vasesArrForDisplay.push({
                ...vase,
                image: currentVase.image,
                name: currentVase.name,
                type: currentVase.type,
                color: currentFil.image,
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
            calculatedInfo.totalPrinted += vase.printed;
            // if (vase.status === 'Ready')
            //     calculatedInfo.totalPrinted += vase.quantity;
        });
        calculatedInfo.totalPrintTime =
            +calculatedInfo.totalPrintTime.toFixed(2);
        calculatedInfo.totalColors = calculatedInfo.totalColors.length;
        const newObj = { ...orderObj.toObject(), toto: 'toto' };
        res.send({ ...newObj, ...calculatedInfo });
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function updateVasePrintedCount(req, res) {
    try {
        const { orderId } = req.params;
        const { isAdd, uniqueKey } = req.body;
        const result = await OrderModel.updateVasePrintedCount(
            orderId,
            uniqueKey,
            isAdd
        );
        res.send(result);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function updateVaseStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { newStatus, uniqueKey } = req.body;
        const result = await OrderModel.updateVaseStatus(
            orderId,
            uniqueKey,
            newStatus
        );
        res.send(result);
    } catch (err) {
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
        return responseError(res, err.message);
    }
}

async function createOrder(req, res) {
    try {
        const newOrder = await OrderModel.createOrder(req.body);
        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.NODE_ENV_SENDGRID)
        const msg = {
            to: ['lidor5500@gmail.com', 'lidor@cubee3d.com', 'oded@cubee3d.com', 'daniel@cubee3d.com'], // Change to your recipient
            from: 'lidor@cubee3d.com', // Change to your verified sender
            subject: `New Order In Order Manager from ${newOrder.customerName}!`,
            text: 'Please check it out on the Order Manager.',
            html: '<strong>Thanks.</strong>',
          }
          sgMail
            .sendMultiple(msg)
            .then(() => {
                console.log('emails sent succesfully');
            })
            .catch((error) => {
              console.error(error)
            })
        res.send(newOrder);
    } catch (err) {
        err;
        return responseError(res, err.message);
    }
}

async function getAllOrders(req, res) {
    try {
        const orders = await OrderModel.getAllOrders();
        const totalVases = orders.reduce((total, order) => {
            return Libs.Utils.getTotalVases(order.selectedVasesArray) + total;
        }, 0);
        // const totalPrintTime = orders.reduce((total, order) =>{
        //     return Libs.Utils.getTotalPrintTime(order.selectedVasesArray) + total
        // }, 0)
        // const newObj = { ...orders.toObject(), toto: 'toto' };
        res.send({ orders: orders, totalVases: totalVases });
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
