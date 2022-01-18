import { Button } from '@mui/material';
import React from 'react';
import ReactTooltip from 'react-tooltip';

export function VasePreview({ vase, deleteVase, editVase }) {
    const onRemoveVase = () => {
        deleteVase(vase._id);
    };
    const onEditVase = () => {
        console.log('open');
        editVase(vase);
    };

    const isAnySize =
        !vase.sizes.small.printTime &&
            !vase.sizes.small.printTime &&
            !vase.sizes.small.printTime ? (
            <p>No Sizes Available</p>
        ) : ('');

    return (
        <article id={`${vase._id}-card`} className="vase-card">
            <p>{vase.name + ' ' + vase.type}</p>
            <div className="sizesp">
                {vase.sizes.small.printTime > 0 && (
                    <span
                        className="sizeHover"
                        data-tip
                        data-for={vase._id + 'S'}
                    >
                        S
                    </span>
                )}
                <ReactTooltip id={vase._id + 'S'}>
                    <span>
                        Small
                        <br />
                        Weight: {vase.sizes.small.weight}
                        <br />
                        Height {vase.sizes.small.height} / Diamter{' '}
                        {vase.sizes.small.height}
                        <br />
                        Print Time: {vase.sizes.small.printTime}h
                    </span>
                </ReactTooltip>

                {vase.sizes.medium.printTime > 0 && (
                    <span
                        className="sizeHover"
                        data-tip
                        data-for={vase._id + 'M'}
                    >
                        M
                    </span>
                )}
                <ReactTooltip id={vase._id + 'M'}>
                    <span>
                        Medium
                        <br />
                        Weight: {vase.sizes.medium.weight}
                        <br />
                        Height {vase.sizes.medium.height} / Diamter{' '}
                        {vase.sizes.medium.height}
                        <br />
                        Print Time: {vase.sizes.medium.printTime}h
                    </span>
                </ReactTooltip>

                {vase.sizes.large.printTime > 0 && (
                    <span
                        className="sizeHover"
                        data-tip
                        data-for={vase._id + 'L'}
                    >
                        L
                    </span>
                )}
                <ReactTooltip id={vase._id + 'L'}>
                    <span>
                        Large
                        <br />
                        Weight: {vase.sizes.large.weight}
                        <br />
                        Height {vase.sizes.large.height} / Diamter{' '}
                        {vase.sizes.large.height}
                        <br />
                        Print Time: {vase.sizes.large.printTime}h
                    </span>
                </ReactTooltip>
            </div>
            {isAnySize}
            <img
                id={`${vase._id}-img`}
                src={vase.image}
                alt="vaseimg"
                className={'vase-img'}
            />
            <div className="edit-delete-btns">
                <Button
                    onClick={onEditVase}
                    variant="contained"
                    color="primary"
                >
                    Edit
                </Button>
                <Button
                    onClick={onRemoveVase}
                    variant="contained"
                    color="error"
                >
                    Remove
                </Button>
            </div>
        </article>
    );
}
