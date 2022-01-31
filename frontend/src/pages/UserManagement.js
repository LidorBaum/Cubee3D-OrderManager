import React, { useEffect, useState, useContext, useRef } from 'react';
import userService from '../services/userService';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';
import { emptyUserObj } from '../services/utils';
import { uploadImg } from '../services/cloudinaryService';
// import { height } from '@mui/system';

import { snackSavedUser } from '../snackMessages';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    height: 600,
};

export const UserManagement = () => {
    if (window.screen.width < 1000) {
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '77%';
    }
    const [users, setUsers] = useState(null);
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [filter, setFilter] = useState('Show All');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefresh, setDoRefresh] = useState(false);
    const [open, setOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState({
        ...emptyUserObj,
    });
    const valueRef = useRef('');

    const [primaryImgUrl, setPrimaryUrl] = useState(
        userToEdit.image ||
            'https://res.cloudinary.com/echoshare/image/upload/v1638211337/1997805_dje7p6.png'
    );
    useEffect(() => {
        const getAllUsers = async () => {
            let res;
            if (filter === 'Show All')
                res = await userService.getFilteredUsers();
            else res = await userService.getFilteredUsers(filter);
            if (res.error) return notificationHandler.error(res.error.message);
            console.log(res);
            setUsers(res);
            console.log(userToEdit);
        };
        getAllUsers();
    }, [filter, isRefresh]);

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

    const handleChangeFilter = event => {
        setFilter(event.target.value);
    };

    const handleChangeUserType = e => {
        // e.persist()
        setUserToEdit(prevForm => {
            return { ...prevForm, type: e.target.value, password: '' };
        });
        console.log(userToEdit);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setPrimaryUrl(
            'https://res.cloudinary.com/echoshare/image/upload/v1643374508/Cubee3D/2884221-200_z5tsjy.png'
        );
        setDoRefresh(!isRefresh);
        setUserToEdit(emptyUserObj);
        setOpen(false);
    };

    const handleChange = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setUserToEdit(prevForm => {
            return { ...prevForm, [target]: value };
        });
    };

    const editUser = user => {
        setUserToEdit(user);
        if (user.image) setPrimaryUrl(user.image);
        handleOpen();
    };

    const onAddUser = async e => {
        e.preventDefault();
        setIsLoading(true);
        const userObj = { ...userToEdit, image: primaryImgUrl };
        if (
            userObj.image ===
            'https://res.cloudinary.com/echoshare/image/upload/v1643374508/Cubee3D/2884221-200_z5tsjy.png'
        )
            userObj.image = undefined;
        console.log(userObj);
        if (userObj._id) {
            const updateUser = await userService.updateUser(userObj);
            if (updateUser.error) {
                notificationHandler.error(updateUser.error.message);
                return setIsLoading(false);
            }
        } else {
            const newUser = await userService.addUser(userObj);
            if (newUser.error) {
                notificationHandler.error(newUser.error.message);
                return setIsLoading(false);
            }
        }
        notificationHandler.success(snackSavedUser);
        setIsLoading(false);
        setUserToEdit({ ...emptyUserObj });
        handleClose();
        setDoRefresh(!isRefresh);
    };

    if (!users)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );
    return (
        <React.Fragment>
            <div className="user-page">
                <Button
                    className="add-new-btn"
                    variant="contained"
                    onClick={handleOpen}
                >
                    Add New User
                </Button>
                <Box className="filter-box">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Filter
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="Filter"
                            onChange={handleChangeFilter}
                        >
                            <MenuItem value={'admin'}>Admins</MenuItem>
                            <MenuItem value={'customer'}>Customers</MenuItem>
                            <MenuItem value={'Show All'}>Show All</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <div className="user-list">
                    {users.map(user => {
                        return (
                            <article className="user-card" key={user._id}>
                                <h2>{user.name}</h2>
                                <p>{user.type}</p>

                                {}
                                <img
                                    className="user-profile-img"
                                    src={
                                        user.image ||
                                        'https://res.cloudinary.com/echoshare/image/upload/v1643374508/Cubee3D/2884221-200_z5tsjy.png'
                                    }
                                />

                                <Button
                                    onClick={() => editUser(user)}
                                    variant="contained"
                                >
                                    Edit Details
                                </Button>
                            </article>
                        );
                    })}
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="user-modal-container">
                    {/* <FormControl fullWidth> */}
                    <h2>User Details</h2>
                    <form
                        className="user-form"
                        id="user-form"
                        onSubmit={onAddUser}
                    >
                        <div className="user-form-basic">
                            <TextField
                                required
                                label="Name"
                                name="name"
                                value={userToEdit.name}
                                onChange={handleChange}
                                type="text"
                                // inputProps={{ min: 1 }}
                            />

                            <Box className="filter-box">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Type
                                    </InputLabel>

                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={userToEdit.type || ''}
                                        label="typig"
                                        onChange={handleChangeUserType}
                                    >
                                        <MenuItem value={'admin'}>
                                            Admin
                                        </MenuItem>
                                        <MenuItem value={'customer'}>
                                            Customer
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <TextField
                                label="Password"
                                name="password"
                                value={userToEdit.password}
                                onChange={handleChange}
                                style={{
                                    display:
                                        userToEdit.type === 'admin'
                                            ? ''
                                            : 'none',
                                }}
                                inputRef={valueRef}
                                type="password"
                                // style={{width: 240}}
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
                    <Box textAlign="center">
                        <Button
                            disabled={isUploading || isLoading}
                            form="user-form"
                            type={'submit'}
                            className="save-btn"
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
};
