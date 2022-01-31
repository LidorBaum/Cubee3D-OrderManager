import React from 'react';
import { VaseOrderPreview } from './VaseOrderPreview';

export const VaseOrderList = ({ vases, handleOpen }) => {
    return (
        <React.Fragment>
            <div className="vase-list">
                {vases.map(vase => (
                    <VaseOrderPreview
                        key={vase._id}
                        vase={vase}
                        handleOpen={handleOpen}
                    />
                ))}
            </div>
        </React.Fragment>
    );
};
