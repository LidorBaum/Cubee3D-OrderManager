import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { OrderPreview } from '../cmps/orderPreview';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { snackNoOrders } from '../snackMessages';
import orderService from '../services/orderService';
import { useHistory } from 'react-router';
import { UserContext } from '../contexts/UserContext';

export const CustomerOrdersPage = () => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [ordersObj, setOrders] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const notificationHandler = useContext(SnackbarHandlerContext);
    let history = useHistory();
    useEffect(() => {
        const getCustomerOrders = async () => {
            const res = await orderService.getCustomerOrders(loggedUser._id);
            if (res.error) return notificationHandler.error(res.error.message);
            if (!res.orders.length) {
                notificationHandler.error(snackNoOrders);
            }
            setOrders(res);
        };
        if (!loggedUser) return;
        getCustomerOrders();
    }, [loggedUser, isRefresh]);

    const onInspect = orderId => {
        history.push(`/orders/order/${orderId}`);
    };

    if (!ordersObj)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );
    return (
        <React.Fragment>
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
                    <h2>{loggedUser.name}'s Orders</h2>

                    <h3>Total Orders: {ordersObj.orders.length}</h3>
                    <h3>Total Vases: {ordersObj.totalVases}</h3>
                </div>
            </div>
        </React.Fragment>
    );
};
