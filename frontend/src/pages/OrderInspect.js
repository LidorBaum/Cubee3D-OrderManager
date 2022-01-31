import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import {
    snackInvalidOrderStatus,
    snackNotCompletedOrder,
} from '../snackMessages';
import orderService from '../services/orderService';
import {
    Button,
    CircularProgress,
    Box,
    Typography,
    CardMedia,
} from '@mui/material';
import { OrderInspectProductList } from '../cmps/OrderInspectProductList';
import io from 'socket.io-client';
import { UserContext } from '../contexts/UserContext';

const { baseURL } = require('../config');
const socket = io(baseURL);

//this object describes the current status and next status - for button text
const statuses = {
    Pending: 'Approve Order',
    Approved: 'Start Printing',
    Printing: 'Order Ready',
    Ready: 'Order Shipped',
    Shipped: 'Order Delivered',
    Delivered: null,
    Cancelled: null,
};
const borderStatus = {
    Pending: 'orange',
    Approved: '#45e9ff',
    Printing: '#a270ff',
    Ready: 'green',
};
const vaseStatuses = {
    Pending: 'Start Printing',
    Printing: 'Vase Ready',
    Ready: null,
};
const progressCircleColors = {
    0: 'blue.500',
    200: 'xx',
};

export const OrderInspect = ({ match }) => {
    const [orderForDetails, setOrder] = useState(null);
    const [progress, setProgress] = useState(0);

    const notificationHandler = useContext(SnackbarHandlerContext);
    const [isRefresh, setDoRefresh] = useState(false);

    useEffect(() => {
        const getOrder = async () => {
            const res = await orderService.getOrderById(match.params.orderId);
            if (res.error) return notificationHandler.error(res.error.message);
            setOrder(res);
            setTimeout(() => {
                setProgress((res.totalPrinted / res.totalVases) * 100 + 200);
            }, 1000);
        };
        getOrder();
    }, [match.params.orderId, isRefresh]);

    useEffect(() => {
        socket.emit('dashboard', match.params.orderId);
    }, [match.params.orderId]);

    useEffect(() => {
        socket.on('update_dashboard', ({ orderId }) => {
            setDoRefresh(!isRefresh);
        });
    }, []);

    const updateConnectedSockets = async orderId => {
        await socket.emit('update_dashboard', {
            orderId,
        });
    };

    const onChangeStatus = async () => {
        const statusesArr = Object.keys(statuses);
        const indexOff = statusesArr.findIndex(
            status => status === orderForDetails.status
        );

        if (orderForDetails.status === 'Printing' && progress !== 300)
            return notificationHandler.error(snackNotCompletedOrder);
        const res = await orderService.updateOrder({
            ...orderForDetails,
            status: statusesArr[indexOff + 1],
        });
        if (res.error) return notificationHandler.error(res.error.message);
        setOrder(prevOrder => {
            return { ...prevOrder, ...res };
        });
        updateConnectedSockets(orderForDetails._id);
    };

    const onChangeVasePrintedCount = async product => {
        const indexOfProduct = orderForDetails.vasesArrForDisplay.findIndex(
            prod => {
                return (
                    prod.vaseId === product.vaseId &&
                    prod.filamentId === product.filamentId &&
                    prod.vaseSize === product.vaseSize
                );
            }
        );
        const res = await orderService.updateVasePrintedCount({
            orderId: orderForDetails._id,
            uniqueKey: {
                vaseId: orderForDetails.selectedVasesArray[indexOfProduct]
                    .vaseId,
                filamentId:
                    orderForDetails.selectedVasesArray[indexOfProduct]
                        .filamentId,
                vaseSize:
                    orderForDetails.selectedVasesArray[indexOfProduct].vaseSize,
            },
            isAdd: product.isAdd,
        });
        if (res.error) return notificationHandler.error(res.error.message);
        setOrder(prevOrder => {
            return { ...prevOrder, ...res };
        });
        updateConnectedSockets(orderForDetails._id);
        setDoRefresh(!isRefresh);
    };

    const onChangeVaseStatus = async product => {
        if (orderForDetails.status !== 'Printing')
            return notificationHandler.error(snackInvalidOrderStatus);
        const vaseStatusesArr = Object.keys(vaseStatuses);
        const indexOfProduct = orderForDetails.vasesArrForDisplay.findIndex(
            prod => {
                return (
                    prod.vaseId === product.vaseId &&
                    prod.filamentId === product.filamentId &&
                    prod.vaseSize === product.vaseSize
                );
            }
        );
        const indexOfStatus = vaseStatusesArr.findIndex(
            status =>
                status ===
                orderForDetails.selectedVasesArray[indexOfProduct].status
        );
        const res = await orderService.updateVaseStatus({
            orderId: orderForDetails._id,
            uniqueKey: {
                vaseId: orderForDetails.selectedVasesArray[indexOfProduct]
                    .vaseId,
                filamentId:
                    orderForDetails.selectedVasesArray[indexOfProduct]
                        .filamentId,
                vaseSize:
                    orderForDetails.selectedVasesArray[indexOfProduct].vaseSize,
            },
            newStatus: vaseStatusesArr[indexOfStatus + 1],
        });
        if (res.error) return notificationHandler.error(res.error.message);
        setOrder(prevOrder => {
            return { ...prevOrder, ...res };
        });
        setDoRefresh(!isRefresh);
        updateConnectedSockets(orderForDetails._id);
    };

    if (!orderForDetails)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );

    return (
        <div
            className="order-inspect"
            style={{
                borderLeft: `10px solid ${
                    borderStatus[orderForDetails.status]
                }`,
            }}
        >
            <div className="order-information">
                <div className="progress-div">
                    <Box
                        className="progress"
                        sx={{
                            color: progressCircleColors[progress]
                                ? 'text.secondary'
                                : 'primary.main',
                            position: 'relative',
                            display: 'inline-flex',
                        }}
                    >
                        <CircularProgress
                            size={150}
                            color="inherit"
                            variant="determinate"
                            value={progress === 200 ? 100 : progress}
                        />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                fontSize={25}
                                variant="caption"
                                component="div"
                                color="text.secondary"
                            >
                                {progress === 0
                                    ? '0%'
                                    : `${Math.round(progress - 200)}%`}
                            </Typography>
                        </Box>
                    </Box>
                </div>
                <div className="right-info">
                    <p className="status-btn">
                        <Button
                            onClick={onChangeStatus}
                            variant="contained"
                            style={{ textTransform: 'none', m: 'auto' }}
                            sx={{
                                display: statuses[orderForDetails.status]
                                    ? 'block'
                                    : 'none',
                            }}
                            className="change-status-btn"
                        >
                            {statuses[orderForDetails.status]}
                        </Button>
                    </p>
                    <p>Order status: {orderForDetails.status}</p>
                    <div className="total-printed">
                        <p>
                            Total Printed:{' '}
                            <span>
                                {orderForDetails.totalPrinted}/
                                {orderForDetails.totalVases}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="center-info">
                    <p>
                        Total Weight:{' '}
                        <span>{orderForDetails.totalWeight}g</span>
                    </p>
                    <p>
                        Total Colors: <span>{orderForDetails.totalColors}</span>
                    </p>
                    <p>
                        Total Print Time:{' '}
                        <span>{orderForDetails.totalPrintTime}h</span>
                    </p>
                </div>

                <div className="left-info">
                    <p>
                        Customer: <span>{orderForDetails.customerName}</span>{' '}
                    </p>
                    <p>
                        Date:{' '}
                        <span>
                            {new Intl.DateTimeFormat('en-il', {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                hour: 'numeric',
                                minute: 'numeric',
                            }).format(new Date(orderForDetails.createdAt))}{' '}
                        </span>
                    </p>
                    <p>
                        Total Vases: <span>{orderForDetails.totalVases}</span>{' '}
                    </p>
                </div>
            </div>
            <div className="order-vases">
                <OrderInspectProductList
                    isAdmin={true}
                    productList={orderForDetails.vasesArrForDisplay}
                    changeStatus={onChangeVaseStatus}
                    changeCount={onChangeVasePrintedCount}
                />
            </div>

            {/* <h3>Total Orders: {orderForDetails._id}</h3> */}
            {/* <p>{JSON.stringify(orderForDetails)}</p> */}
        </div>
    );
};
