import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { OrderPreview } from '../cmps/OrderPreview';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { snackNoOrders } from '../snackMessages';
import orderService from '../services/orderService';
import { useHistory } from 'react-router';
let totalVases = 0;

export const OrderManagement = () => {
    const [orders, setOrders] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const notificationHandler = useContext(SnackbarHandlerContext);
    let history = useHistory()
    useEffect(() => {
        const getAllOrders = async () => {
            const res = await orderService.getAllOrders();
            if (res.error) return notificationHandler.error(res.error.message);
            console.log(res);
            if (!res.length) {
                notificationHandler.error(snackNoOrders);
            }
            res.map(order => {
                console.log(order.selectedVasesArray.length);
                totalVases += order.selectedVasesArray.length;
            });
            setOrders(res);
        };
        getAllOrders();
    }, [isRefresh]);

    const onInspect = (orderId) =>{
        history.push(`/inventory/order/${orderId}`)
    }

    if (!orders || (orders && totalVases === 0))
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );
    return (
        <div className="order-manage">
            <div className="order-list">
                {orders.map(order => {
                    return <OrderPreview key={order._id} orderObj={order} onInspect={onInspect}/>;
                })}
            </div>
            <div className="statistics">
                <h3>Total Orders: {orders.length}</h3>
                <h3>Total Vases: {totalVases}</h3>
                <h3>Total Print Time: </h3>
                <h3>Total Print Weight: </h3>
            </div>
        </div>
    );
};
