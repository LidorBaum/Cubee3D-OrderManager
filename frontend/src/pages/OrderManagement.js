import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { OrderPreview } from '../cmps/orderPreview';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { snackNoOrders } from '../snackMessages';
import orderService from '../services/orderService';
import { useHistory } from 'react-router';

export const OrderManagement = () => {
    const [ordersObj, setOrders] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const notificationHandler = useContext(SnackbarHandlerContext);
    let history = useHistory();
    useEffect(() => {
        const getAllOrders = async () => {
            const res = await orderService.getAllOrders();
            if (res.error) return notificationHandler.error(res.error.message);
            if (!res.orders.length) {
                notificationHandler.error(snackNoOrders);
            }
            setOrders(res);
        };
        getAllOrders();
    }, [isRefresh]);

    const onInspect = orderId => {
        history.push(`/inventory/order/${orderId}`);
    };

    if (!ordersObj)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );
    return (
        <div className="order-manage">
            <div className="order-list">
                {ordersObj.orders.map(order => {
                    return (
                        <OrderPreview
                            key={order._id}
                            orderObj={order}
                            onInspect={onInspect}
                        />
                    );
                })}
            </div>
            <div className="statistics">
                <h3>Total Orders: {ordersObj.orders.length}</h3>
                <h3>Total Vases: {ordersObj.totalVases}</h3>
                {/* <h3>Total Print Time: </h3>
                <h3>Total Print Weight: </h3> */}
            </div>
        </div>
    );
};
