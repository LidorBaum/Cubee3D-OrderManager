import { Button } from '@mui/material';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

export function CartPreview({ productObj, removeProduct }) {
    const onRemoveProduct = () => {
        removeProduct({
            vaseId: productObj.vaseId,
            filamentId: productObj.filamentId,
            size: productObj.size,
        });
    };

    return (
        <article id={`${productObj._id}-cart-card`} className="vase-cart-card">
            <img className="cart-vase" alt="vaseimg" src={productObj.image} />
            <img
                className="cart-filament"
                alt="filamentimg"
                src={productObj.color}
            />
            <div className="info">
                <p>{productObj.name + ' ' + productObj.type}</p>
                <p>{productObj.size}</p>
                <p>Quantity: {productObj.quantity}</p>
            </div>
            <Button
                size="small"
                onClick={onRemoveProduct}
                variant="contained"
                color="error"
            >
                Remove
            </Button>
        </article>
    );
}
