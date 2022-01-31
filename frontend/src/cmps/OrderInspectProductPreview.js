import React, { useState, useContext } from 'react';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';

import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
    snackPrintedBelow0,
    snackPrintedAboveQuantity,
} from '../snackMessages';
import ReactTooltip from 'react-tooltip';
const vaseStatuses = {
    Pending: 'Start Printing',
    Printing: 'Vase Ready',
    Ready: null,
};

export function OrderInspectProductPreview({
    productObj,
    changeStatus,
    isAdmin,
    changeCount,
}) {
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [isLoading, setIsLoading] = useState(false);

    const onChangeStatus = () => {
        changeStatus({
            vaseId: productObj.vaseId,
            filamentId: productObj.filamentId,
            vaseSize: productObj.vaseSize,
        });
    };
    const onChangeCountPlus = () => {
        setIsLoading(true);
        if (productObj.quantity === productObj.printed) {
            setIsLoading(false);
            return notificationHandler.error(snackPrintedAboveQuantity);
        }
        changeCount({
            isAdd: true,
            vaseId: productObj.vaseId,
            filamentId: productObj.filamentId,
            vaseSize: productObj.vaseSize,
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };
    const onChangeCountMinus = () => {
        setIsLoading(true);
        console.log(productObj);
        if (productObj.printed === 0) {
            setIsLoading(false);
            return notificationHandler.error(snackPrintedBelow0);
        }
        changeCount({
            isAdd: false,
            vaseId: productObj.vaseId,
            filamentId: productObj.filamentId,
            vaseSize: productObj.vaseSize,
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };
    const vaseStatuses = {
        Pending: 'Start Printing',
        Printing: 'Vase Ready',
        Ready: null,
    };

    return (
        <article
            id={`${productObj.vaseId}-cart-card`}
            className="vase-order-card"
            style={!isAdmin ? { height: '450px' } : {}}
        >
            <div className="order-card-imgs">
                <img
                    className="order-vase"
                    alt="vaseimg"
                    src={productObj.image}
                />
                <img
                    className="order-filament"
                    alt="filamentimg"
                    src={productObj.color}
                />
            </div>
            <div className="info">
                <p>{productObj.name + ' ' + productObj.type}</p>
                <p>
                    {productObj.vaseSize.charAt(0).toUpperCase() +
                        productObj.vaseSize.slice(1)}
                </p>
                <p>Quantity: {productObj.quantity}</p>
                <p>
                    <span>{productObj.status}</span>
                </p>
                {productObj.status === 'Printing' && (
                    <div>
                        <p>
                            Printed {productObj.printed} / {productObj.quantity}
                        </p>
                        {isAdmin &&
                            (productObj.printed !== productObj.quantity ? (
                                <div className="plus-minus-container">
                                    <Button
                                        disabled={isLoading}
                                        onClick={onChangeCountPlus}
                                    >
                                        <AddCircleOutlineIcon fontSize="large" />
                                    </Button>
                                    <Button
                                        disabled={
                                            isLoading ||
                                            productObj.printed === 0
                                        }
                                        onClick={onChangeCountMinus}
                                    >
                                        <RemoveCircleOutlineIcon fontSize="large" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={onChangeStatus}
                                    style={{ textTransform: 'none' }}
                                    sx={{
                                        display:
                                            productObj.status != 'Ready'
                                                ? ''
                                                : 'none',
                                    }}
                                    variant="contained"
                                >
                                    {vaseStatuses[productObj.status]}
                                </Button>
                            ))}
                    </div>
                )}
                {isAdmin && productObj.status !== 'Printing' && (
                    <Button
                        onClick={onChangeStatus}
                        style={{ textTransform: 'none' }}
                        sx={{
                            display: productObj.status != 'Ready' ? '' : 'none',
                        }}
                        variant="contained"
                    >
                        {vaseStatuses[productObj.status]}
                    </Button>
                )}
            </div>
        </article>
    );
}
