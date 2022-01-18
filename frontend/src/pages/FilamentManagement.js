import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FilamentList } from '../cmps/FilamentList';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import filamentService from '../services/filamentService';
import {
    snackFilamentDeleted,
    snackNoFilaments,
    snackNoImg,
    snackSavedFilament,
} from '../snackMessages';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { uploadImg } from '../services/cloudinaryService';
import { emptyFilamentObj } from '../services/utils';
import { TextField, Modal, Box, Button } from '@mui/material';

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
};

export const FialmentMangement = () => {
    if (window.screen.width < 1000) {
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '80%';
    }
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [filaments, setFilaments] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filamentToEdit, setFilamentToEdit] = useState({
        ...emptyFilamentObj,
    });
    const [primaryImgUrl, setPrimaryUrl] = useState(
        filamentToEdit.image ||
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
    );

    useEffect(() => {
        const getAllFilaments = async () => {
            const res = await filamentService.getAllFilaments();
            if (res.error) return notificationHandler.error(res.error.message);
            if (!res.length) {
                notificationHandler.error(snackNoFilaments);
            }
            setFilaments(res);
        };
        getAllFilaments();
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
        setFilamentToEdit(emptyFilamentObj);
        setOpen(false);
    };
    
    const handleChange = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setFilamentToEdit(prevForm => {
            return { ...prevForm, [target]: value };
        });
    };

    const deleteFilament = async filamentId => {
        const res = await filamentService.removeFilament(filamentId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        setDoRefresh(!isRefresh);
        notificationHandler.warning(snackFilamentDeleted);
    };

    const editFilament = filament => {
        setFilamentToEdit(filament);
        setPrimaryUrl(filament.image);
        handleOpen();
    };

    const onAddFilament = async e => {
        e.preventDefault();
        setIsLoading(true);
        if (
            primaryImgUrl ===
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
        ) {
            setIsLoading(false);
            return notificationHandler.error(snackNoImg);
        }
        const filamentObj = { ...filamentToEdit, image: primaryImgUrl };
        if (filamentObj._id) {
            filamentObj._id = filamentToEdit._id;
            const updateFilament = await filamentService.updateFilament(
                filamentObj
            );
            if (updateFilament.error) {
                notificationHandler.error(updateFilament.error.message);
                return setIsLoading(false);
            }
        } else {
            const newFilament = await filamentService.addFilament(filamentObj);
            if (newFilament.error) {
                notificationHandler.error(newFilament.error.message);
                return setIsLoading(false);
            }
        }
        notificationHandler.success(snackSavedFilament);
        setIsLoading(false);
        setFilamentToEdit({ ...emptyFilamentObj });
        handleClose();
    };

    if (!filaments)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );

    return (
        <div>
            <div className="inventory-nav">
                <Button variant="contained" disabled>
                    Filaments
                </Button>
                <Link style={{ textDecoration: 'none' }} to="/inventory/vase">
                    <Button variant="contained">Vases</Button>{' '}
                </Link>
            </div>
            <Box textAlign="center" sx={{ 'margin-top': 10 }}>
                <Button
                    onClick={handleOpen}
                    className="add-new-btn"
                    variant="contained"
                >
                    Add New Filament
                </Button>
            </Box>
            <div>
                <FilamentList
                    filaments={filaments}
                    deleteFilament={deleteFilament}
                    editFilament={editFilament}
                />
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* <FormControl fullWidth> */}
                    <h2>New Filament</h2>
                    <form
                        className="filament-form"
                        id="filament-form"
                        onSubmit={onAddFilament}
                    >
                        <div className="filament-form-basic">
                            <TextField
                                required
                                label="Color"
                                name="color"
                                value={filamentToEdit.color}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                label="Brand"
                                name="vendor"
                                value={filamentToEdit.vendor}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                label="Store"
                                name="store"
                                value={filamentToEdit.store}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                label="Weight"
                                name="weight"
                                value={filamentToEdit.weight}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: 1 }}
                            />
                            <TextField
                                required
                                label="Price"
                                name="price"
                                value={filamentToEdit.price}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: 1 }}
                            />

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
                    </form>
                    {/* </FormControl> */}
                    <Box textAlign="center" sx={{ 'margin-top': 30 }}>
                        <Button
                            disabled={isUploading || isLoading}
                            form="filament-form"
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
