import httpService from './httpService';

export default {
    createOrder,
    updateOrder,
    getOrderById,
    removeOrder,
    getAllOrders,
};

async function createOrder(orderObj) {
    return await httpService.post('order', orderObj);
}
function updateOrder(orderObj) {
    return httpService.put(`order/edit/${orderObj._id}`, orderObj);
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
