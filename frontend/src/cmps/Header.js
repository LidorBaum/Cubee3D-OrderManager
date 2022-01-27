import React, { useState, useContext, useRef, useEffect } from 'react';

import { NavLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import { CartContext } from '../contexts/CartContext';
import userService from '../services/userService';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import LoginIcon from '@mui/icons-material/Login';
import FaceIcon from '@mui/icons-material/Face';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Badge, TextField } from '@mui/material';
import { snackNoUserFound, snackMissingCreds } from '../snackMessages';

const darkTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#fff',
        },
        secondary: {
            main: '#5a5a5a',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

const navLinks = {
    customer: {
        Orders: '/orders',
        Products: '/order',
    },
    admin: {
        Orders: '/inventory/order',
        Vase: '/inventory/vase',
        Filament: '/inventory/filament',
        Products: '/order',
    },
    guest: {
        Products: '/order',
    },
};

const settings = ['Orders', 'Logout'];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const Header = props => {
    if (window.screen.width < 1000) {
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '40%';
    }
    let history = useHistory();
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const notificationHandler = useContext(SnackbarHandlerContext);
    const { cart } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(false);
    const [menuType, setMenuType] = useState('guest');
    //boolean to know if the user is known type
    const [isKnownType, setIsKnownType] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [loginForm, setLoginForm] = useState({
        name: '',
        password: '',
    });
    const valueRef = useRef('');

    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        setMenuType(loggedUser ? loggedUser.type : 'guest');
    }, [loggedUser]);

    const handleClose = () => {
        setLoginForm({
            name: '',
            password: '',
        });
        setIsKnownType(false);
        setOpen(false);
    };
    const handleChange = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setLoginForm(prevForm => {
            return { ...prevForm, [target]: value };
        });
    };

    const onLogin = async e => {
        e.preventDefault();
        setIsLoading(true);
        if (!loginForm.name)
            return notificationHandler.error(snackMissingCreds);
        if (!isKnownType) {
            const res = await userService.checkUserExistAndType(loginForm.name);
            setIsLoading(false);
            if (res.error) return notificationHandler.error(res.error.message);
            if (res.noUserFound)
                return notificationHandler.error(snackNoUserFound);
            if (res.admin) {
                setIsKnownType(true);
                setIsLoading(false);
                valueRef.current.focus();
                return;
            }
            return onLoginCustomer(res);
        }
        return onLoginAdmin();
    };

    const onLoginCustomer = user => {
        setLoggedUser(user);
        setIsLoading(false);
        userService.login(user);
        setMenuType('customer');
        handleClose();
    };

    const onLoginAdmin = async () => {
        if (!loginForm.name || !loginForm.password)
            return notificationHandler.error(snackMissingCreds);
        const user = await userService.adminLogin(loginForm);
        if (user.error) {
            notificationHandler.error(user.error.message);
            setIsLoading(false);
            return;
        }
        setLoggedUser(user);
        userService.login(user);
        setIsLoading(false);
        setMenuType('admin');
        handleClose();
    };

    const onResetFormState = () => {
        if (isKnownType) {
            setIsKnownType(false);
            setLoginForm(prev => {
                return { ...prev, password: '' };
            });
        }
    };

    const onClickMenuItem = async setting => {
        if (setting === 'Logout') {
            handleCloseUserMenu();
            setMenuType('guest');
            userService.logout();
            setLoggedUser(null);
            return history.push('/order');
        }
        handleCloseUserMenu();
        history.push('/orders');
    };

    const handleOpenNavMenu = event => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = event => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <React.Fragment>
            <header>
                <ThemeProvider theme={darkTheme}>
                    <AppBar position="fixed">
                        <Container maxWidth="false">
                            <Toolbar disableGutters>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'none', md: 'flex' },
                                    }}
                                >
                                    <img
                                        alt="logo"
                                        src={
                                            'https://res.cloudinary.com/echoshare/image/upload/v1642510871/Cubee3D/new-logo_vqg9pl.svg'
                                        }
                                    />
                                </Typography>

                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        display: { xs: 'flex', md: 'none' },
                                    }}
                                >
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenu}
                                        sx={{
                                            display: {
                                                xs: 'block',
                                                md: 'none',
                                            },
                                        }}
                                    >
                                        {Object.keys(navLinks[menuType]).map(
                                            page => (
                                                <NavLink
                                                    activeClassName="active"
                                                    exact={true}
                                                    to={`${navLinks[menuType][page]}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                    }}
                                                    key={page}
                                                    onClick={handleCloseNavMenu}
                                                >
                                                    <MenuItem key={page}>
                                                        <Typography
                                                            color="secondary"
                                                            textAlign="center"
                                                        >
                                                            {page}
                                                        </Typography>
                                                    </MenuItem>
                                                </NavLink>
                                            )
                                        )}
                                    </Menu>
                                </Box>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{
                                        flexGrow: 1,
                                        display: { xs: 'flex', md: 'none' },
                                    }}
                                >
                                    <img
                                        alt="profile"
                                        src={
                                            'https://res.cloudinary.com/echoshare/image/upload/v1642510871/Cubee3D/new-logo_vqg9pl.svg'
                                        }
                                    />
                                </Typography>
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        display: { xs: 'none', md: 'flex' },
                                    }}
                                >
                                    {Object.keys(navLinks[menuType]).map(
                                        page => (
                                            <NavLink
                                                key={page}
                                                activeClassName="active"
                                                exact={true}
                                                to={`${navLinks[menuType][page]}`}
                                                style={{
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Button
                                                    color="secondary"
                                                    label={page}
                                                    sx={{
                                                        my: 2,
                                                        color: '#5a5a5a',
                                                        display: 'block',
                                                    }}
                                                >
                                                    {page}
                                                </Button>
                                            </NavLink>
                                        )
                                    )}
                                </Box>

                                <Box
                                    sx={{ flexGrow: 0 }}
                                    className="profile-cart-btns"
                                >
                                    <NavLink
                                        to="/cart"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Badge
                                            className="cart-icon"
                                            badgeContent={cart.length}
                                            color="secondary"
                                        >
                                            {' '}
                                            <ShoppingCartIcon
                                                className="cart-icon"
                                                color="secondary"
                                                fontSize="large"
                                            />{' '}
                                        </Badge>
                                    </NavLink>
                                    <Tooltip
                                        title={
                                            loggedUser
                                                ? 'Account options'
                                                : 'Login'
                                        }
                                    >
                                        <IconButton
                                            onClick={
                                                loggedUser
                                                    ? handleOpenUserMenu
                                                    : handleOpen
                                            }
                                            sx={{ p: 0 }}
                                        >
                                            {' '}
                                            {loggedUser ? (
                                                loggedUser.image ? (
                                                    <Avatar
                                                        alt={loggedUser.name}
                                                        src={
                                                            'https://res.cloudinary.com/echoshare/image/upload/v1642465658/Cubee3D/61995740_2245317985550489_7473695634269143040_n_pr2m2w.jpg'
                                                        }
                                                    />
                                                ) : (
                                                    <FaceIcon
                                                        className="cart-icon"
                                                        color="secondary"
                                                        fontSize="large"
                                                    />
                                                )
                                            ) : (
                                                <LoginIcon
                                                    className="cart-icon"
                                                    color="secondary"
                                                    fontSize="large"
                                                />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map(setting => (
                                            <MenuItem
                                                key={setting}
                                                onClick={() =>
                                                    onClickMenuItem(setting)
                                                }
                                            >
                                                <Typography textAlign="center">
                                                    {setting}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </Toolbar>
                        </Container>
                    </AppBar>
                </ThemeProvider>
            </header>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="login-form-container">
                    <p>Welcome Back!</p>
                    <p>Log into your account</p>
                    <form
                        className="login-form"
                        id="login-form"
                        onSubmit={onLogin}
                    >
                        <TextField
                            required
                            label="Name"
                            name="name"
                            value={loginForm.name}
                            onChange={handleChange}
                            autoFocus={!isKnownType}
                            disabled={isKnownType}
                            onClick={onResetFormState}
                            // style={{"&:hover":{cursor: 'pointer'}}}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            value={loginForm.password}
                            onChange={handleChange}
                            style={{ display: isKnownType ? '' : 'none' }}
                            inputRef={valueRef}
                            // style={{width: 240}}
                        />
                        <Button
                            className="login-btn"
                            variant="contained"
                            disabled={isLoading}
                            type="submit"
                        >
                            Login
                        </Button>
                    </form>
                </Box>
            </Modal>
        </React.Fragment>
    );
};
