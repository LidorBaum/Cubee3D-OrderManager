import React from 'react';
import { VaseOrderPreview } from './VaseOrderPreview';

export const VaseOrderList = ({ vases, handleOpen }) => {
    return (
        <>
            <div className="vase-list">
                {vases.map(vase => (
                    <VaseOrderPreview
                        key={vase._id}
                        vase={vase}
                        handleOpen={handleOpen}
                    />
                ))}
            </div>
        </>
    );
};
