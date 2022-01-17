import { Button } from '@mui/material';
import React from 'react';
import { CartPreview } from './CartPreview';

export const Cart = ({ selectedProducts, removeProduct, onPlaceOrder }) => {
    const getTotal = () => {
        return selectedProducts.reduce(acc, 0);
    };
    const acc = (total, product) => {
        return product.quantity + total;
    };
    return (
        <div className="cart">
            {selectedProducts.map(productObj => {
                return (
                    <CartPreview
                        key={
                            productObj.vaseId +
                            productObj.filamentId +
                            productObj.size
                        }
                        productObj={productObj}
                        removeProduct={removeProduct}
                    />
                );
            })}
            <p>Total: {getTotal()} Vases</p>
            <Button
                onClick={onPlaceOrder}
                disabled={selectedProducts.length <= 0}
                className="place-order-btn"
                variant="contained"
            >
                Place Order
            </Button>
        </div>
    );
};
