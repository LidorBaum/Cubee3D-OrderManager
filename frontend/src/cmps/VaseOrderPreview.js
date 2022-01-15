import { Button } from '@mui/material';
import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';

export function VaseOrderPreview({ vase, handleOpen }) {
    const onSelectSize = size => {
        const dbSize = size.toLowerCase();
        const vaseObj = {
            name: vase.name,
            type: vase.type,
            quantity: 1,
            size: size,
            vaseId: vase._id,
            image: vase.image,
            dimensions: `Height ${vase.sizes[dbSize].height}mm, Diamter ${vase.sizes[dbSize].diamter}mm`,
        };
        handleOpen(vaseObj);
    };

    return (
        <article id={`${vase._id}-card`} className="vase-card">
            <p>{vase.name + ' ' + vase.type}</p>
            <div className="sizesp">
                <span
                    onClick={() => onSelectSize('Small')}
                    className="sizeHover sizeButton"
                    data-tip
                    data-for={vase._id + 'S'}
                >
                    S
                </span>
                <ReactTooltip id={vase._id + 'S'}>
                    <span>
                        Small
                        <br />
                        Height {vase.sizes.small.height}mm / Diamter{' '}
                        {vase.sizes.small.height}mm
                    </span>
                </ReactTooltip>

                <span
                    onClick={() => onSelectSize('Medium')}
                    className="sizeHover sizeButton"
                    data-tip
                    data-for={vase._id + 'M'}
                >
                    M
                </span>
                <ReactTooltip id={vase._id + 'M'}>
                    <span>
                        Medium
                        <br />
                        Height {vase.sizes.medium.height}mm / Diamter{' '}
                        {vase.sizes.medium.height}mm
                    </span>
                </ReactTooltip>

                <span
                    onClick={() => onSelectSize('Large')}
                    className="sizeHover sizeButton"
                    data-tip
                    data-for={vase._id + 'L'}
                >
                    L
                </span>
                <ReactTooltip id={vase._id + 'L'}>
                    <span>
                        Large
                        <br />
                        Height {vase.sizes.large.height}mm / Diamter{' '}
                        {vase.sizes.large.height}mm
                    </span>
                </ReactTooltip>
            </div>
            <img
                id={`${vase._id}-img`}
                src={vase.image}
                alt="vaseimg"
                className={'vase-img'}
            />
        </article>
    );
}
