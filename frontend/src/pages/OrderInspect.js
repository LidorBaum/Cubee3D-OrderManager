import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { OrderPreview } from '../cmps/OrderPreview';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { snackNoOrders } from '../snackMessages';
import orderService from '../services/orderService';

export const OrderInspect = ({ match }) => {
    const [orderForDetails, setOrder] = useState(null);

    const notificationHandler = useContext(SnackbarHandlerContext);


    useEffect(() => {
        const getOrder = async () => {
            const res = await orderService.getOrderById(match.params.orderId)
            // console.log(res);
            setOrder(res)
        }
        getOrder()
    }, [match.params.orderId])




    if (!orderForDetails) return <div className="loader">
        <Hypnosis width="200px" height="200px" duration="3s" />
    </div>

    return (
        <div className="order-manage">
                {/* <h3>Total Orders: {orderForDetails._id}</h3> */}
                <p>{ JSON.stringify(orderForDetails)}</p>

        </div>
    );
};
