import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';
import { UserContext } from './contexts/UserContext';
import { SnackbarHandlerContext } from './contexts/SnackbarHandlerContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { Header } from './cmps/Header';
import { Footer } from './cmps/Footer';
import { LoginSignup } from './pages/LoginSignup';
import Cookies from 'js-cookie';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { VaseManagment } from './pages/VaseManagment';
import { FialmentMangement } from './pages/FilamentManagement';
import { OrderPage } from './pages/OrderPage';
import { OrderManagement } from './pages/OrderManagement';
import { CartPage } from './pages/CartPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { CartContext } from './contexts/CartContext';
import { OrderInspect } from './pages/OrderInspect';
import { snackUnauthorized } from './snackMessages';
import userService from './services/userService';
import { CustomerOrderInspect } from './pages/CustomerOrderInspect';

let userFromCookie;
if (Cookies.get('user')) {
    userFromCookie = JSON.parse(Cookies.get('user'));
} else userFromCookie = null;
console.log(userFromCookie);
window.userFromCookie = userFromCookie
function App() {
    const [loggedUser, setLoggedUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [snack, setSnack] = useState({});
    useEffect(() => {
        const getUpdatedUser = async () => {
            const updated = await userService.getById(userFromCookie._id);
            setLoggedUser(updated);
        };
        if (userFromCookie) getUpdatedUser();
        if (loggedUser) {
            userFromCookie = loggedUser;
            return;
        }
        if (Cookies.get('user')) {
            setLoggedUser(JSON.parse(Cookies.get('user')));
        }
        if (Cookies.get('cart')) {
            const cartJson = JSON.parse(Cookies.get('cart'));
            setCart(cartJson);
        }
    }, []);

    useEffect(() => {
        if (loggedUser) userFromCookie = loggedUser;
    }, [loggedUser]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnack(prevSnack => {
            return { ...prevSnack, open: false };
        });
    };

    const notificationHandler = {
        success: message => showNotification('success', message),
        error: message => showNotification('error', message),
        info: message => showNotification('info', message),
        warning: message => showNotification('warning', message),
    };

    const showNotification = (severity, message) => {
        const snackObj = { severity, message, open: true };
        if (snack.open) {
            setSnack(prevSnack => {
                return { ...prevSnack, open: false };
            });
            return setTimeout(() => {
                setSnack(snackObj);
            }, 100);
        } else setSnack(snackObj);
    };

    const unauthorized = () => {
        notificationHandler.error(snackUnauthorized);
        return <Redirect to="/order" />;
    };

    return (
        <div className="App">
            <Router>
                <CartContext.Provider value={{ cart, setCart }}>
                    <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
                        <SnackbarHandlerContext.Provider
                            value={notificationHandler}
                        >
                            <SnackbarContext.Provider
                                value={{ snack, setSnack }}
                            >
                                {
                                    <Snackbar
                                        TransitionComponent={Slide}
                                        onClose={handleClose}
                                        autoHideDuration={3000}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        open={snack.open}
                                    >
                                        <Alert
                                            onClose={handleClose}
                                            severity={snack.severity}
                                            sx={{ width: '100%' }}
                                        >
                                            {snack.message}
                                            {/* <Button onClick={handleClose}>Share</Button> */}
                                        </Alert>
                                    </Snackbar>
                                }
                                <Header />
                                <div className="content">
                                    <ScrollToTop smooth />
                                    <Switch>
                                        <Route
                                            path="/"
                                            exact
                                            component={OrderPage}
                                        />
                                        <Route
                                            path="/login"
                                            component={LoginSignup}
                                        />
                                        <Route
                                            path="/inventory/vase"
                                            // component={VaseManagment}
                                            render={() =>
                                                userFromCookie &&
                                                    userFromCookie.type ===
                                                    'admin' ? (
                                                    <VaseManagment />
                                                ) : (
                                                    unauthorized()
                                                )
                                            }
                                        />
                                        <Route
                                            path="/inventory/filament"
                                            render={() =>
                                                userFromCookie &&
                                                    userFromCookie.type ===
                                                    'admin' ? (
                                                    <FialmentMangement />
                                                ) : (
                                                    unauthorized()
                                                )
                                            }
                                        />
                                        <Route
                                            path="/inventory/order/:orderId"
                                            // component={OrderInspect}
                                            render={props =>
                                                userFromCookie &&
                                                    userFromCookie.type ===
                                                    'admin' ? (
                                                    <OrderInspect {...props} />
                                                ) : (
                                                    unauthorized()
                                                )
                                            }
                                        />
                                        <Route
                                            path="/inventory/order"
                                            exact
                                            render={() =>
                                                    (userFromCookie?.type ===
                                                    'admin' || userFromCookie?.type === 'customer') ? (
                                                    <OrderManagement />
                                                ) : (
                                                    unauthorized()
                                                )
                                            }
                                        />
                                        <Route
                                            path="/order"
                                            // render={() => OrderPage}
                                            component={OrderPage}
                                        />
                                        <Route
                                            path="/orders/order/:orderId"
                                            // render={() => OrderPage}
                                            // component={CustomerOrderInspect}
                                            render={props =>
                                                ['admin', 'customer'].includes(userFromCookie?.type)
                                                ? (
                                                    <CustomerOrderInspect {...props} />
                                                ) : (
                                                    unauthorized()
                                                )
                                            }
                                        />
                                        <Route
                                            path="/orders"
                                            exact
                                            // render={() => OrderPage}
                                            render={props =>
                                                ['admin', 'customer'].includes(userFromCookie?.type)
                                                ? (
                                                    <CustomerOrdersPage {...props} />
                                                ) : (
                                                    unauthorized()
                                                )
                                            }
                                        // component={CustomerOrdersPage}
                                        />
                                        <Route
                                            path="/cart"
                                            // render={() => CartPage}
                                            component={CartPage}
                                        />
                                    </Switch>
                                </div>
                                <Footer />
                            </SnackbarContext.Provider>
                        </SnackbarHandlerContext.Provider>
                    </UserContext.Provider>
                </CartContext.Provider>
            </Router>
        </div>
    );
}

export default App;
