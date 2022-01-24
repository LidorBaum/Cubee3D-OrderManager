import React from 'react';
import { OrderInspectProductPreview } from './OrderInspectProductPreview';

export const OrderInspectProductList = ({ productList, changeStatus }) => {
    console.log(productList, 'PRODUCT LIST');
    return (
        <>
            <div className="order-product-list">
                {productList.map(product => (
                    <OrderInspectProductPreview
                        key={product.vaseId + product.filamentId}
                        changeStatus={changeStatus}
                        productObj={product}
                    />
                ))}
            </div>
        </>
    );
};
