import React, { useState } from 'react';
import { Button } from '@mui/material';
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
}) {
    const onChangeStatus = () => {
        changeStatus({
            vaseId: productObj.vaseId,
            filamentId: productObj.filamentId,
            vaseSize: productObj.vaseSize,
        });
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
            style={!isAdmin ? { height: '370px' } : {}}
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
                {isAdmin && (
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
