import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { VaseList } from '../cmps/VaseList';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import vaseService from '../services/vaseService';
import { Button, TextField, MenuItem, Modal, Box } from '@mui/material';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { uploadImg } from '../services/cloudinaryService';
import { emptyVaseObj } from '../services/utils';
import {
    snackNoVases,
    snackVaseDeleted,
    snackNoImg,
    snackSavedVase,
} from '../snackMessages';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    m: 'auto',
};

export const VaseManagment = () => {
    if (window.screen.width < 800) {
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '80%';
    }
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [vases, setVases] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [vaseToEdit, setVaseToEdit] = useState({ ...emptyVaseObj });
    const [primaryImgUrl, setPrimaryUrl] = useState(
        vaseToEdit.image ||
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
    );
    window.vaseToEdit = vaseToEdit;

    useEffect(() => {
        const getAllVases = async () => {
            const res = await vaseService.getAllVases();
            if (res.error) return notificationHandler.error(res.error.message);
            console.log(res);
            if (!res.length) {
                notificationHandler.error(snackNoVases);
            }
            setVases(res);
        };
        getAllVases();
    }, [isRefresh]);

    const onUploadImg = async e => {
        e.persist();
        setIsUploading(true);
        const url = await uploadImg(e);
        if (url.error) {
            notificationHandler.error(url.error.message);
            return setIsLoading(false);
        }
        setPrimaryUrl(url);
        setIsUploading(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setPrimaryUrl(
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
        );
        setDoRefresh(!isRefresh);
        setVaseToEdit({
            name: '',
            type: '',
            sizes: {
                small: {
                    height: 0,
                    diameter: 0,
                    weight: 0,
                    printTime: '',
                },
                medium: {
                    height: 0,
                    diameter: 0,
                    weight: 0,
                    printTime: '',
                },
                large: {
                    height: 0,
                    diameter: 0,
                    weight: 0,
                    printTime: '',
                },
            },
            image: '',
        });
        setOpen(false);
    };

    const handleChange = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setVaseToEdit(prevForm => {
            return { ...prevForm, [target]: value };
        });
    };

    const handleSelectChange = e => {
        setVaseToEdit(prevForm => {
            return { ...prevForm, type: e.target.value };
        });
    };

    const handleSizeInputsChange = e => {
        e.persist();
        const size = e.target.dataset.sizing;
        const target = e.target.name;
        const value = e.target.value;
        console.log(`${value} @ ${target} @ ${size}`);
        let prevSizesObj = vaseToEdit.sizes;
        let specificSize = prevSizesObj[size];
        specificSize[target] = value;
        prevSizesObj = { ...prevSizesObj, [size]: specificSize };
        setVaseToEdit(prevForm => {
            return { ...prevForm, prevSizesObj };
        });
    };

    const deleteVase = async vaseId => {
        const res = await vaseService.removeVase(vaseId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        setDoRefresh(!isRefresh);
        notificationHandler.success(snackVaseDeleted);
    };

    const editVase = vase => {
        setVaseToEdit(vase);
        setPrimaryUrl(vase.image);
        handleOpen();
    };

    const onAddVase = async e => {
        e.preventDefault();
        setIsLoading(true);
        if (
            primaryImgUrl ===
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
        ) {
            setIsLoading(false);
            return notificationHandler.error(snackNoImg);
        }
        const vaseObj = { ...vaseToEdit, image: primaryImgUrl };
        if (vaseToEdit._id) {
            vaseObj._id = vaseToEdit._id;
            const updatedVase = await vaseService.updateVase(vaseObj);
            if (updatedVase.error) {
                notificationHandler.error(updatedVase.error.message);
                return setIsLoading(false);
            }
        } else {
            const newVase = await vaseService.addVase(vaseObj);
            if (newVase.error) {
                notificationHandler.error(newVase.error.message);
                return setIsLoading(false);
            }
        }
        notificationHandler.success(snackSavedVase);
        setIsLoading(false);
        setVaseToEdit({ ...emptyVaseObj });
        handleClose();
    };

    if (!vases)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );

    return (
        <div className="vase-page">
            <div className="inventory-nav">
                <Link
                    style={{ textDecoration: 'none' }}
                    to="/inventory/filament"
                >
                    {' '}
                    <Button variant="contained">Filaments</Button>
                </Link>
                <Button disabled variant="contained">
                    Vases
                </Button>
            </div>{' '}
            <Box textAlign="center" sx={{ 'margin-top': 10 }}>
                <Button
                    onClick={handleOpen}
                    className="add-new-btn"
                    variant="contained"
                >
                    Add New Vase
                </Button>
            </Box>
            <div>
                <VaseList
                    vases={vases}
                    deleteVase={deleteVase}
                    editVase={editVase}
                />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="vase-form-modal"
            >
                <Box sx={style} clasName="vase-form-modal-box">
                    {/* <FormControl fullWidth> */}
                    <form id="vase-form" onSubmit={onAddVase}>
                        <div className="vase-form-basic">
                            <TextField
                                required
                                label="Vase Name"
                                name="name"
                                value={vaseToEdit.name}
                                onChange={handleChange}
                            />

                            <TextField
                                select
                                label="Type"
                                value={vaseToEdit.type}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value={'Planter'}>Planter</MenuItem>
                                <MenuItem value={'Vase'}>Vase</MenuItem>
                                <MenuItem value={'Bowl'}>Bowl</MenuItem>
                            </TextField>

                            <div className="form-img">
                                <label htmlFor="img-input">
                                    <img
                                        alt="profile img"
                                        className="primary-img"
                                        src={primaryImgUrl}
                                    />
                                    <input
                                        id="img-input"
                                        hidden
                                        onChange={onUploadImg}
                                        type="file"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="vase-form-sizes">
                            <h2>Available Sizes</h2>
                            <h4>Leave blank if not exist</h4>
                            <br />
                            <h3>Small</h3>
                            <div className="vase-form-sizes-input">
                                <TextField
                                    label="Height (mm)"
                                    name="height"
                                    value={vaseToEdit.sizes.small.height || ''}
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'small',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Diameter (mm)"
                                    name="diameter"
                                    value={
                                        vaseToEdit.sizes.small.diameter || ''
                                    }
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'small',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Weight (g)"
                                    name="weight"
                                    value={vaseToEdit.sizes.small.weight || ''}
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'small',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />

                                <TextField
                                    label="Print Time (h)"
                                    name="printTime"
                                    value={
                                        vaseToEdit.sizes.small.printTime === '0'
                                            ? ''
                                            : vaseToEdit.sizes.small.printTime
                                    }
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'small',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                            </div>
                            <br />
                            <h3>Medium</h3>
                            <div className="vase-form-sizes-input">
                                <TextField
                                    label="Height (mm)"
                                    name="height"
                                    value={vaseToEdit.sizes.medium.height || ''}
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'medium',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Diameter (mm)"
                                    name="diameter"
                                    value={
                                        vaseToEdit.sizes.medium.diameter || ''
                                    }
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'medium',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Weight (g)"
                                    name="weight"
                                    value={vaseToEdit.sizes.medium.weight || ''}
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'medium',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Print Time (h)"
                                    name="printTime"
                                    value={
                                        vaseToEdit.sizes.medium.printTime ===
                                        '0'
                                            ? ''
                                            : vaseToEdit.sizes.medium.printTime
                                    }
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'medium',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                            </div>
                            <br />
                            <h3>Large</h3>
                            <div className="vase-form-sizes-input">
                                <TextField
                                    label="Height (mm)"
                                    name="height"
                                    value={vaseToEdit.sizes.large.height || ''}
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'large',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Diameter (mm)"
                                    name="diameter"
                                    value={
                                        vaseToEdit.sizes.large.diameter || ''
                                    }
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'large',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Weight (g)"
                                    name="weight"
                                    value={vaseToEdit.sizes.large.weight || ''}
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'large',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                                <TextField
                                    label="Print Time (h)"
                                    name="printTime"
                                    value={
                                        vaseToEdit.sizes.large.printTime === '0'
                                            ? ''
                                            : vaseToEdit.sizes.large.printTime
                                    }
                                    onChange={handleSizeInputsChange}
                                    type="number"
                                    size="small"
                                    style={{ width: 150 }}
                                    inputProps={{
                                        'data-sizing': 'large',
                                        min: 1,
                                        step: '0.01',
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                    {/* </FormControl> */}
                    <Box textAlign="center" sx={{ 'margin-top': 30 }}>
                        <Button
                            disabled={isUploading || isLoading}
                            form="vase-form"
                            type={'submit'}
                            className="save-btn"
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};
