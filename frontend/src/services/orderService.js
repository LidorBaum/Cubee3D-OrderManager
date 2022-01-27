import httpService from './httpService';

export default {
    createOrder,
    updateOrder,
    getOrderById,
    removeOrder,
    getAllOrders,
    getTotalPrintTime,
    updateVaseStatus,
    getCustomerOrders
};

async function getCustomerOrders(customerId){
    return await httpService.get(`order/orders/${customerId}`)
}

async function getTotalPrintTime(vaseArray) {
    return await httpService.get('order/printTime', vaseArray);
}

async function createOrder(orderObj) {
    return await httpService.post('order', orderObj);
}
function updateOrder(orderObj) {
    return httpService.put(`order/edit/${orderObj._id}`, {
        newStatus: orderObj.status,
    });
}

function updateVaseStatus(orderObj) {
    return httpService.put(`order/edit/${orderObj.orderId}/vase`, {
        ...orderObj,
    });
}

function getOrderById(orderId) {
    return httpService.get(`order/${orderId}`);
}

function removeOrder(orderId) {
    return httpService.delete(`order/${orderId}`);
}

function getAllOrders() {
    return httpService.get('order');
}
