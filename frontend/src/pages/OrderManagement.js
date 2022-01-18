import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { OrderPreview } from '../cmps/orderPreview';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { snackNoOrders } from '../snackMessages';
import orderService from '../services/orderService';
let totalVases = 0;

export const OrderManagement = () => {
    const [orders, setOrders] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const notificationHandler = useContext(SnackbarHandlerContext);

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
                    return <OrderPreview key={order._id} orderObj={order} />;
                })}
            </div>
            <div className="statistics">
                <h2>Total Orders: {orders.length}</h2>
                <h2>Total Vases: {totalVases}</h2>
            </div>
        </div>
    );
};
