import React from 'react';
import { Button } from '@mui/material';

export function CartPreview({ productObj, removeProduct, editProduct }) {
    const onRemoveProduct = () => {
        removeProduct({
            vaseId: productObj.vaseId,
            filamentId: productObj.filamentId,
            size: productObj.size,
        });
    };
    const onEditProduct = () => {
        editProduct({
            vaseId: productObj.vaseId,
            selectedColorId: productObj.filamentId,
            size: productObj.size,
        });
    };

    return (
        <article
            id={`${productObj.vaseId}-cart-card`}
            className="vase-cart-card"
        >
            <div className="cart-card-imgs">
                <img
                    className="cart-vase"
                    alt="vaseimg"
                    src={productObj.image}
                />
                <img
                    className="cart-filament"
                    alt="filamentimg"
                    src={productObj.color}
                />
            </div>
            <div className="info">
                <p>{productObj.name + ' ' + productObj.type}</p>
                <p>
                    {productObj.size.charAt(0).toUpperCase() +
                        productObj.size.slice(1)}
                </p>
                <p>Quantity: {productObj.quantity}</p>
            </div>
            <div className="card-actions-btns">
                <Button
                    onClick={onEditProduct}
                    variant="contained"
                    color="primary"
                >
                    Edit
                </Button>
                <Button
                    onClick={onRemoveProduct}
                    variant="contained"
                    color="error"
                >
                    Remove
                </Button>
            </div>
        </article>
    );
}
