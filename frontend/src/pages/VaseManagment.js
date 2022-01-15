import React, { useEffect, useState, useContext } from 'react';
import { VaseList } from '../cmps/VaseList';
// import { useHistory } from 'react-router-dom';
// import { CompanyContext } from '../contexts/CompanyContext';
// import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
// import employeeService from '../services/employeeService';
// import io from 'socket.io-client';
// import Spin from 'react-cssfx-loading/lib/Spin';
// import Select from 'react-select';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import vaseService from '../services/vaseService';
import { snackNoVases, snackVaseDeleted } from '../snackMessages';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { uploadImg } from '../services/cloudinaryService';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const VaseManagment = () => {
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [vases, setVases] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [vaseToEdit, setVaseToEdit] = useState({
        name: '',
        type: '',
    });
    const [primaryImgUrl, setPrimaryUrl] = useState(
        vaseToEdit.image ||
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
    );
    const [vaseForm, setForm] = useState({
        name: vaseToEdit.name,
        type: vaseToEdit.type,
    });
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
        setOpen(false);
    };
    const handleChange = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setForm(prevForm => {
            return { ...prevForm, [target]: value };
        });
    };

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
    }, []);

    const deleteVase = async vaseId => {
        console.log('deleteing vase');
        const res = await vaseService.removeVase(vaseId);
        if (res.error) {
            return notificationHandler.error(res.error.message);
        }
        setDoRefresh(!isRefresh);
        notificationHandler.warning(snackVaseDeleted);
    };
    const onAddVase = async () => {};

    if (!vases)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );
    if (vases && vases.length === 0) return <h1>No Vases</h1>;
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
            <Button
                onClick={handleOpen}
                className="add-new-btn"
                variant="contained"
            >
                Add New Vase
            </Button>
            <div>
                <VaseList vases={vases} deleteVase={deleteVase} />
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={onAddVase}>
                        <TextField
                            required
                            label="Vase Name"
                            name="name"
                            value={vaseForm.name}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            label="Vase Type"
                            name="type"
                            value={vaseForm.type}
                            onChange={handleChange}
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
                    </form>
                </Box>
            </Modal>
        </div>
    );
};
