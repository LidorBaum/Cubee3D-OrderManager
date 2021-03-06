import React from 'react';
import { VasePreview } from './VasePreview';

export const VaseList = ({ vases, deleteVase, editVase }) => {
    return (
        <>
            <div className="vase-list">
                {vases.map(vase => (
                    <VasePreview
                        key={vase._id}
                        vase={vase}
                        deleteVase={deleteVase}
                        editVase={editVase}
                    />
                ))}
            </div>
        </>
    );
};
