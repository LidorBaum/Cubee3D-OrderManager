import React, { useContext, useEffect } from 'react';

import { Redirect, NavLink } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
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
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
    Orders: '/inventory/order',
    Vase: '/inventory/vase',
    Filament: '/inventory/filament',
    Products: '/order',
};
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
export const Header = props => {
    let history = useHistory();
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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
        // <div className='header'>
        <header>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="static">
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
                                        display: { xs: 'block', md: 'none' },
                                    }}
                                >
                                    {Object.keys(navLinks).map(page => (
                                        <NavLink
                                            activeClassName="active"
                                            exact={true}
                                            to={`${navLinks[page]}`}
                                            style={{ textDecoration: 'none' }}
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
                                    ))}
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
                                {Object.keys(navLinks).map(page => (
                                    <NavLink
                                        key={page}
                                        activeClassName="active"
                                        exact={true}
                                        to={`${navLinks[page]}`}
                                        style={{ textDecoration: 'none' }}
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
                                ))}
                            </Box>

                            <Box
                                sx={{ flexGrow: 0 }}
                                className="profile-cart-btns"
                            >
                                <NavLink
                                    to="/cart"
                                    style={{ textDecoration: 'none' }}
                                >
                                    {' '}
                                    <ShoppingCartIcon
                                        className="cart-icon"
                                        color="secondary"
                                        fontSize="large"
                                    />{' '}
                                </NavLink>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            alt="Gimi Sharp"
                                            src="/static/images/avatar/2.jpg"
                                        />
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
                                            onClick={handleCloseNavMenu}
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

            {/* <div className="links">
                <img src={'https://res.cloudinary.com/echoshare/image/upload/v1642510871/Cubee3D/new-logo_vqg9pl.svg'}/>
                <NavLink
                    activeClassName="active"
                    to={'/inventory/vase'}
                    exact={true}
                >
                    Vases
                </NavLink>
                <NavLink
                    activeClassName="active"
                    to={'/inventory/filament'}
                    exact={true}
                >
                    Filaments
                </NavLink>
                <NavLink
                    activeClassName="active"
                    to={'/inventory/order'}
                    exact={true}
                >
                    Orders
                </NavLink>
                <NavLink activeClassName="active" to={'/order'} exact={true}>
                    Place An Order
                </NavLink>
                <NavLink activeClassName="active" to={'/cart'} exact={true}>
                    <ShoppingCartIcon/>
                </NavLink>
            </div> */}
        </header>
        //    {/* {store && <img src='https://res.cloudinary.com/echoshare/image/upload/v1642465658/Cubee3D/61995740_2245317985550489_7473695634269143040_n_pr2m2w.jpg' />} */}
        //{/* </div> */}
    );
};
