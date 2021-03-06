import React, { useEffect, useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { snackInvalidOrderStatus } from '../snackMessages';
import orderService from '../services/orderService';
import {
    Button,
    CircularProgress,
    Box,
    Typography,
    Modal,
} from '@mui/material';
import { OrderInspectProductList } from '../cmps/OrderInspectProductList';
import ReactPlayer from 'react-player/twitch';
import io from 'socket.io-client';

const { baseURL } = require('../config');
const socket = io(baseURL);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    width: 1280,
    height: 750
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

export const CustomerOrderInspect = ({ match }) => {
    if (window.screen.width < 1000) {
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '30%';
    }
    const [orderForDetails, setOrder] = useState(null);
    const [progress, setProgress] = useState(0);
    const [open, setOpen] = useState(false);
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
            setDoRefresh(Math.random());
        });
    }, []);

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
        setOrder(prevOrder => {
            return { ...prevOrder, ...res };
        });
        setDoRefresh(!isRefresh);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
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
                borderLeft: `10px solid ${borderStatus[orderForDetails.status]
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
                <div className="live-stream">
                    <Button
                        onClick={handleOpen}
                        size="large"
                        variant="contained"
                        color="secondary"
                    >
                        Watch Live Stream
                    </Button>
                </div>
                <div className="right-info">
                    <p className="order-status-p">
                        Order status: <span>{orderForDetails.status}</span>
                    </p>
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
                        Total Vases: <span>{orderForDetails.totalVases}</span>{' '}
                    </p>
                </div>
            </div>
            <div className="order-vases">
                <OrderInspectProductList
                    isAdmin={false}
                    productList={orderForDetails.vasesArrForDisplay}
                    changeStatus={onChangeVaseStatus}
                />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="user-modal-container">
                    <ReactPlayer
                        width="100%"
                        height="100%"
                        playing={true}
                        volume={0}
                        muted={true}
                        autoPlay
                        controls={false}
                        url="https://www.twitch.tv/echoshop3d"
                    />
                </Box>
            </Modal>
        </div>
    );
};
