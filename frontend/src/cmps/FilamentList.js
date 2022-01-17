import React from 'react';
import { FilamentPreview } from './FilamentPreview';

export const FilamentList = ({ filaments, deleteFilament, editFilament }) => {
    return (
        <>
            <div className="filament-list">
                {filaments.map(filament => (
                    <FilamentPreview
                        key={filament._id}
                        filament={filament}
                        deleteFilament={deleteFilament}
                        editFilament={editFilament}
                    />
                ))}
            </div>
        </>
    );
};
