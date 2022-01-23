import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { OrderPreview } from '../cmps/orderPreview';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { snackNoOrders } from '../snackMessages';
import orderService from '../services/orderService';

export const OrderInspect = ({ match }) => {
    const [orderForDetails, setOrder] = useState(null);

    const notificationHandler = useContext(SnackbarHandlerContext);

    useEffect(() => {
        const getOrder = async () => {
            const res = await orderService.getOrderById(match.params.orderId);
            console.log(res);
            setOrder(res);
        };
        getOrder();
    }, [match.params.orderId]);

    if (!orderForDetails)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );

    return (
        <div className="order-manage">
            <div className="order-information">
                <div className="">
                    <p>Customer: {orderForDetails.customerName} </p>
                    <p>Order status: {orderForDetails.status}</p>
                </div>
                <div>
                    <p>
                        Date:{' '}
                        {new Intl.DateTimeFormat('en-il', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: 'numeric',
                        }).format(new Date(orderForDetails.createdAt))}
                    </p>
                    <p>Total Vases: {orderForDetails.totalVases} </p>
                    <p>Total Weight: {orderForDetails.totalWeight}g</p>
                    <p>Total Colors: {orderForDetails.totalColors}</p>
                    <p>Total Print Time: {orderForDetails.totalPrintTime}h</p>
                    <p>
                        Total Printed: {orderForDetails.totalPrinted}/
                        {orderForDetails.totalVases}
                    </p>
                </div>
            </div>
            {/* <h3>Total Orders: {orderForDetails._id}</h3> */}
            {/* <p>{JSON.stringify(orderForDetails)}</p> */}
        </div>
    );
};
