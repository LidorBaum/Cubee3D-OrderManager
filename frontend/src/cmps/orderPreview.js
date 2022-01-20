import React from 'react';
import { Button } from '@mui/material';

export function OrderPreview({ orderObj, onInspect }) {
    let colorsArr = [];
    orderObj.selectedVasesArray.map(vase => {
        if (colorsArr.indexOf(vase.filamentId) === -1)
            colorsArr.push(vase.filamentId);
    });

    const numOfColors = colorsArr.length;

    const inspectOrder = () =>{
        onInspect(orderObj._id)
    }

    return (
        <article id={`${orderObj._id}-order-card`} className="order-card">
            <div className="info">
                <p>{orderObj.customerName}</p>
                <p>{orderObj.selectedVasesArray.length} Vases</p>
                <p>{numOfColors} Colors</p>
                <p>{orderObj.status}</p>
                <p>
                    {new Intl.DateTimeFormat('en-il', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(orderObj.createdAt))}
                </p>
            </div>
            <Button
                size="small"
                onClick={inspectOrder}
                variant="contained"
                color="primary"
            >
                Inspect
            </Button>
        </article>
    );
}
