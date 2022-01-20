import Cookies from 'js-cookie';
import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import orderService from '../services/orderService';
import {
    snackOrderPlaced,
    snackNoStoreName,
    snackNoFilaments,
} from '../snackMessages';
import { CartPreview } from '../cmps/CartPreview';
import ReactTooltip from 'react-tooltip';
import filamentService from '../services/filamentService';
import {
    Modal,
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { NavLink } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 950,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const CartPage = props => {
    if (window.screen.width < 1000) {
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '85%';
    }

    const { cart, setCart } = useContext(CartContext);
    const [openPlaceConfirm, setOpenPlaceConfirm] = useState(false);
    const [orderAttachments, setOrderAttachments] = useState({
        storeName: '',
        comments: '',
    });
    const [open, setOpen] = useState(false);
    const [filaments, setFilaments] = useState(null);

    //ModalContent is also the product choice for adding to cart
    const [modalContent, setModalContent] = useState({
        name: '',
        type: '',
        quantity: 1,
        size: '',
        selectedColor: '',
        selectedColorId: '',
        dimensions: '',
        vaseId: '',
    });

    const [productForEdit, setProductForEdit] = useState(null);

    const notificationHandler = useContext(SnackbarHandlerContext);
    window.productForEdit = productForEdit;
    const onRemoveProduct = productIdentifier => {
        const newCartArr = cart.filter(prod => {
            return !(
                prod.vaseId === productIdentifier.vaseId &&
                prod.filamentId === productIdentifier.filamentId &&
                prod.size === productIdentifier.size
            );
        });
        console.log(newCartArr);
        setCart(newCartArr);
        Cookies.set('cart', JSON.stringify(newCartArr));
    };

    const handleChangeOrderAttachments = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setOrderAttachments(prevAttach => {
            return { ...prevAttach, [target]: value };
        });
    };

    const handleopenConfirmDialog = () => {
        setOpenPlaceConfirm(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenPlaceConfirm(false);
    };
    const onPlaceOrder = () => {
        handleopenConfirmDialog();
    };

    const onChangeQuantity = e => {
        e.persist();
        setModalContent(prevContent => {
            return { ...prevContent, quantity: parseInt(e.target.value) };
        });
    };

    const onColorChoose = colorObj => {
        setModalContent(prevContent => {
            return {
                ...prevContent,
                selectedColor: colorObj.color,
                selectedColorId: colorObj.colorId,
            };
        });
    };
    const onOrderConfirmed = async () => {
        if (!orderAttachments.storeName)
            return notificationHandler.error(snackNoStoreName);
        let selectedProductsForOrderObj = [];
        cart.forEach(prod => {
            return selectedProductsForOrderObj.push({
                vaseId: prod.vaseId,
                vaseSize: prod.size,
                filamentId: prod.filamentId,
                quantity: prod.quantity,
            });
        });
        const orderObj = {
            selectedVasesArray: selectedProductsForOrderObj,
            customerName: orderAttachments.storeName,
            comment: orderAttachments.comments,
        };
        const newOrder = await orderService.createOrder(orderObj);
        if (newOrder.error) {
            notificationHandler.error(newOrder.error.message);
            return;
        }
        Cookies.remove('cart');
        setCart([]);
        handleCloseConfirmDialog();
        notificationHandler.success(snackOrderPlaced);
    };

    const getTotal = () => {
        return cart.reduce(acc, 0);
    };
    const acc = (total, product) => {
        return product.quantity + total;
    };

    const onEditProduct = async productObj => {
        console.log('editing');
        const filamentsArray = await filamentService.getAllFilaments();
        if (filamentsArray.error)
            return notificationHandler.error(filamentsArray.error.message);
        if (!filamentsArray.length) {
            notificationHandler.error(snackNoFilaments);
        }
        console.log(filamentsArray);
        setFilaments(filamentsArray);
        const productForEditObj = cart.find(prod => {
            return (
                prod.vaseId === productObj.vaseId &&
                prod.filamentId === productObj.selectedColorId &&
                prod.size === productObj.size
            );
        });
        setProductForEdit(productForEditObj);
        const colorIndex = filamentsArray.findIndex(filament => {
            return filament._id === productForEditObj.filamentId;
        });
        handleOpen({
            ...productForEditObj,
            selectedColorId: productForEditObj.filamentId,
            selectedColor: filamentsArray[colorIndex].image,
        });
    };

    const handleOpen = productObj => {
        setModalContent({ ...productObj });
        setOpen(true);
    };

    const onSaveChanges = () => {
        const index = cart.findIndex(prod => {
            console.log(prod === productForEdit);
            return prod === productForEdit;
        });
        console.log(index);
        const updatedProduct = {
            vaseId: modalContent.vaseId,
            name: modalContent.name,
            type: modalContent.type,
            size: modalContent.size.toLocaleLowerCase(),
            image: modalContent.image,
            color: modalContent.selectedColor,
            filamentId: modalContent.selectedColorId,
            quantity: modalContent.quantity,
            dimensions: modalContent.dimensions,
        };
        console.log(updatedProduct);
        console.log(cart);

        let newCartArray = [...cart];
        newCartArray.splice(index, 1, updatedProduct);

        console.log(newCartArray);
        setCart(newCartArray);
        Cookies.set('cart', JSON.stringify(newCartArray));
        handleClose();
    };

    const handleClose = () => {
        setModalContent({
            name: '',
            type: '',
            quantity: 1,
            size: '',
            selectedColor: '',
            selectedColorId: '',
            vaseId: '',
            dimensions: '',
        });
        setOpen(false);
    };

    if (cart.length === 0)
        return (
            <div className="empty-cart-container">
                <h2>Hi, your shopping cart is empty, let's fill it up!</h2>
                <NavLink to="/order" style={{ textDecoration: 'none' }}>
                    <Button
                        style={{ textTransform: 'none' }}
                        variant="contained"
                    >
                        Take Me There!
                    </Button>
                </NavLink>
            </div>
        );
    return (
        <React.Fragment>
            <div className="cart-container">
                <div className="cart">
                    <div className="cart-list">
                        {cart.map(productObj => {
                            return (
                                <CartPreview
                                    key={
                                        productObj.vaseId +
                                        productObj.filamentId +
                                        productObj.size
                                    }
                                    productObj={productObj}
                                    removeProduct={onRemoveProduct}
                                    editProduct={onEditProduct}
                                />
                            );
                        })}
                    </div>
                    <div className="cta-cart">
                        <p>Total: {getTotal()} Vases</p>
                        <Button
                            onClick={onPlaceOrder}
                            disabled={cart.length <= 0}
                            className="place-order-btn"
                            variant="contained"
                        >
                            Place Order
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog
                open={openPlaceConfirm}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ mt: 2, minWidth: 500 }}
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {'Are you sure about your order?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please check your cart and make sure everything is
                        correct
                        <br />
                        If everything is fine, please enter your store's name.
                        <br />
                        You can attach a comment also.
                    </DialogContentText>
                    <br />
                    <TextField
                        label="Store Name"
                        name="storeName"
                        value={orderAttachments.storeName}
                        onChange={handleChangeOrderAttachments}
                        required
                    />
                    <br />
                    <TextField
                        sx={{ mt: 2 }}
                        label="Comments"
                        name="comments"
                        value={orderAttachments.comments}
                        onChange={handleChangeOrderAttachments}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="text" onClick={handleCloseConfirmDialog}>
                        <ArrowBackIosNewIcon /> I want to fix!
                    </Button>
                    <Button variant="text" onClick={onOrderConfirmed} autoFocus>
                        <DoubleArrowIcon />
                        Place Order Now!
                    </Button>
                </DialogActions>
            </Dialog>

            {filaments && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div className="vase-choose-popup">
                            <div className="inputs-submit">
                                <div className="inputs">
                                    <p>
                                        {modalContent.name +
                                            ' ' +
                                            modalContent.type}
                                    </p>
                                    <p>
                                        {modalContent.size
                                            .charAt(0)
                                            .toUpperCase() +
                                            modalContent.size.slice(1)}{' '}
                                        size - {modalContent.dimensions}
                                    </p>

                                    <span>Choose Color:</span>
                                    <div className="colors">
                                        {filaments.map(filament => {
                                            const isSelected =
                                                modalContent.selectedColorId ===
                                                filament._id
                                                    ? 'selectedColor'
                                                    : '';
                                            return (
                                                <React.Fragment
                                                    key={filament._id}
                                                >
                                                    <img
                                                        data-tip
                                                        data-for={filament._id}
                                                        key={filament._id}
                                                        onClick={() =>
                                                            onColorChoose({
                                                                color: filament.image,
                                                                colorId:
                                                                    filament._id,
                                                            })
                                                        }
                                                        className={[
                                                            'modal-filament-img',
                                                            isSelected,
                                                        ].join(' ')}
                                                        src={filament.image}
                                                    ></img>
                                                    <ReactTooltip
                                                        id={filament._id}
                                                    >
                                                        <span>
                                                            {filament.color}
                                                        </span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                    <br />
                                    <TextField
                                        onChange={onChangeQuantity}
                                        defaultValue="1"
                                        InputProps={{
                                            inputProps: { min: 0, max: 10 },
                                        }}
                                        size="medium"
                                        type="number"
                                        id="quantity"
                                        label="Quantity"
                                        variant="outlined"
                                        style={{ textTransform: 'none' }}
                                        className='quantity-field'
                                    />
                                </div>
                                <Button
                                    className="add-to-cart-btn"
                                    onClick={onSaveChanges}
                                    className="addtocart"
                                    variant="contained"
                                    style={{
                                        width: '180px',
                                        textTransform: 'none',
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                            <img src={modalContent.image} />
                        </div>
                    </Box>
                </Modal>
            )}
        </React.Fragment>
    );
};
