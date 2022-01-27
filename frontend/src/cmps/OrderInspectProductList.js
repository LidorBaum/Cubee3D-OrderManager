import React from 'react';
import { OrderInspectProductPreview } from './OrderInspectProductPreview';

export const OrderInspectProductList = ({
    productList,
    changeStatus,
    isAdmin,
}) => {
    return (
        <>
            <div className="order-product-list">
                {productList.map(product => (
                    <OrderInspectProductPreview
                        isAdmin={isAdmin}
                        key={product.vaseId + product.filamentId}
                        changeStatus={changeStatus}
                        productObj={product}
                    />
                ))}
            </div>
        </>
    );
};
