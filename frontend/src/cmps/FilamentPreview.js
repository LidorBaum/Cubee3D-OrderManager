import { Button } from '@mui/material';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

export function FilamentPreview({ filament, deleteFilament, editFilament }) {
    console.log(filament);
    const onEditFilament = () =>{
        editFilament(filament)
    }
    const onRemoveFilament = () => {
        deleteFilament(filament._id);
    };

    return (
        <article id={`${filament._id}-card`} className="filament-card">
            <p>
                {filament.color} by {filament.vendor}
            </p>
            <p>Remaining: {filament.weight}g</p>
            <p>Price: {filament.price}</p>
            <p>Store: {filament.store}</p>
            <img
                id={`${filament._id}-img`}
                src={filament.image}
                alt="filamentimg"
                className={'filament-img'}
            />
            <div className='edit-delete-btns'>
            <Button onClick={onEditFilament} variant="contained" color="primary">
                Edit
            </Button>
            <Button
                onClick={onRemoveFilament}
                variant="contained"
                color="error"
            >
                Remove
            </Button>
            </div>
        </article>
    );
}
