import React from 'react';
import { OrderInspectProductPreview } from './OrderInspectProductPreview';

export const OrderInspectProductList = ({
    productList,
    changeStatus,
    isAdmin,
    changeCount,
}) => {
    return (
        <>
            <div className="order-product-list">
                {productList.map(product => (
                    <OrderInspectProductPreview
                        isAdmin={isAdmin}
                        key={
                            product.vaseId +
                            product.filamentId +
                            product.vaseSize
                        }
                        changeStatus={changeStatus}
                        productObj={product}
                        changeCount={changeCount}
                    />
                ))}
            </div>
        </>
    );
};
