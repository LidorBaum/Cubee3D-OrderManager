import { Button } from '@mui/material';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

export function VasePreview({ vase, deleteVase }) {
    console.log(vase);

    const onRemoveVase = () => {
        deleteVase(vase._id);
    };

    return (
        <article id={`${vase._id}-card`} className="vase-card">
            <p>{vase.name + ' ' + vase.type}</p>
            <div className="sizesp">
                <span className="sizeHover" data-tip data-for={vase._id + 'S'}>
                    S
                </span>
                <ReactTooltip id={vase._id + 'S'}>
                    <span>
                        Small
                        <br />
                        Weight: {vase.sizes.small.weight}
                        <br />
                        Height {vase.sizes.small.height} / Diamter{' '}
                        {vase.sizes.small.height}
                        <br />
                        Print Time: {vase.sizes.small.printTime}
                    </span>
                </ReactTooltip>

                <span className="sizeHover" data-tip data-for={vase._id + 'M'}>
                    M
                </span>
                <ReactTooltip id={vase._id + 'M'}>
                    <span>
                        Medium
                        <br />
                        Weight: {vase.sizes.medium.weight}
                        <br />
                        Height {vase.sizes.medium.height} / Diamter{' '}
                        {vase.sizes.medium.height}
                        <br />
                        Print Time: {vase.sizes.medium.printTime}
                    </span>
                </ReactTooltip>

                <span className="sizeHover" data-tip data-for={vase._id + 'L'}>
                    L
                </span>
                <ReactTooltip id={vase._id + 'L'}>
                    <span>
                        Large
                        <br />
                        Weight: {vase.sizes.large.weight}
                        <br />
                        Height {vase.sizes.large.height} / Diamter{' '}
                        {vase.sizes.large.height}
                        <br />
                        Print Time: {vase.sizes.large.printTime}
                    </span>
                </ReactTooltip>
            </div>
            <img
                id={`${vase._id}-img`}
                src={vase.image}
                alt="vaseimg"
                className={'vase-img'}
            />
            <Button onClick={onRemoveVase} variant="contained" color="error">
                Remove
            </Button>
        </article>
    );
}
