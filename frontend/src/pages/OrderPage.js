import React, { useEffect, useState, useContext } from 'react';
import { VaseOrderList } from '../cmps/VaseOrderList';
// import { useHistory } from 'react-router-dom';
// import { CompanyContext } from '../contexts/CompanyContext';
// import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
// import employeeService from '../services/employeeService';
// import io from 'socket.io-client';
// import Spin from 'react-cssfx-loading/lib/Spin';
// import Select from 'react-select';
import { withStyles } from "@material-ui/core/styles";
import ReactTooltip from 'react-tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import vaseService from '../services/vaseService';
import {
    snackNoFilaments,
    snackNoVases,
    quantity0,
    noColorChosen,
    productRemoved,
    snackOrderPlaced,
} from '../snackMessages';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import filamentService from '../services/filamentService';
import { Cart } from '../cmps/Cart';
import Modal from '@mui/material/Modal';
import orderService from '../services/orderService';
import Slide from '@mui/material/Slide';

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
const dialogStyle = {
    mt: 2,
    minWidth: style.width
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export const OrderPage = props => {
    if (window.screen.width < 1000) {
        console.log('mobile');
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '70%';
        dialogStyle.maxWidth= 300
        delete dialogStyle.minWidth
    }
    const [open, setOpen] = useState(false);

    //ModalContent is also the product choice for adding to card
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
    const cartCookie = Cookies.get('cart');
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [vases, setVases] = useState(null);
    const [filaments, setFilaments] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(
        cartCookie ? JSON.parse(cartCookie) : []
    );
    const [openWelcomeDialog, setWelcomeDialog] = useState(false)
    const [store, setStore] = useState('')
    const [openPlaceConfirm, setOpenPlaceConfirm] = useState(false);
    const [orderAttachments, setOrderAttachments] = useState({
        storeName: '',
        comments: '',
    });
    window.selectedProducts = selectedProducts;
    useEffect(() => {
        const getVasesAndFilaments = async () => {
            const vases = await vaseService.getAllVases();
            if (vases.error)
                return notificationHandler.error(vases.error.message);
            if (!vases.length) {
                notificationHandler.error(snackNoVases);
            }
            const filamentsArray = await filamentService.getAllFilaments();
            if (filamentsArray.error)
                return notificationHandler.error(filamentsArray.error.message);
            if (!filamentsArray.length) {
                notificationHandler.error(snackNoFilaments);
            }
            setVases(vases);
            setFilaments(filamentsArray);
            const searchQuery = new URLSearchParams(props.location.search);
            if (searchQuery.get('store')) {
                setWelcomeDialog(true)
                setStore(searchQuery.get('store'))
            }
        };
        getVasesAndFilaments();
    }, []);

    const handleOpen = vaseObj => {
        setModalContent({ ...vaseObj, selectedColor: '' });
        setOpen(true);
    };

    const handleopenConfirmDialog = () => {
        setOpenPlaceConfirm(true);
    };
    const handleCloseConfirmDialog = () => {
        setOpenPlaceConfirm(false);
    };

    const handleCloseWelcomeDialog = () =>{
        setWelcomeDialog(false)
    }

    const onPlaceOrder = () => {
        handleopenConfirmDialog();
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

    const onChangeQuantity = e => {
        e.persist();
        setModalContent(prevContent => {
            return { ...prevContent, quantity: parseInt(e.target.value) };
        });
    };

    const handleChangeOrderAttachments = e => {
        e.persist();
        const target = e.target.name;
        const value = e.target.value;
        setOrderAttachments(prevAttach => {
            return { ...prevAttach, [target]: value };
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
        console.log(modalContent);
    };

    const onAddToCart = () => {
        let isExist = false;
        const productToAdd = {
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
        if (productToAdd.quantity < 1)
            return notificationHandler.error(quantity0);
        if (!productToAdd.filamentId)
            return notificationHandler.error(noColorChosen);

        for (let i = 0; i < selectedProducts.length; i++) {
            if (
                selectedProducts[i].vaseId === productToAdd.vaseId &&
                selectedProducts[i].filamentId === productToAdd.filamentId &&
                selectedProducts[i].size === productToAdd.size
            ) {
                selectedProducts[i].quantity =
                    selectedProducts[i].quantity + productToAdd.quantity;
                isExist = true;
                break;
            }
        }
        if (!isExist) selectedProducts.push(productToAdd);
        console.log(selectedProducts);
        Cookies.set('cart', JSON.stringify(selectedProducts));
        handleClose();
    };

    const onRemoveProduct = productIdentifier => {
        console.log(productIdentifier);
        setSelectedProducts(
            selectedProducts.filter(prod => {
                return !(
                    prod.vaseId === productIdentifier.vaseId &&
                    prod.filamentId === productIdentifier.filamentId &&
                    prod.size === productIdentifier.size
                );
            })
        );
        notificationHandler.success(productRemoved);
    };

    const onOrderConfirmed = async () => {
        console.log('place the order');
        let selectedProductsForOrder = [];
        selectedProducts.forEach(prod => {
            return selectedProductsForOrder.push({
                vaseId: prod.vaseId,
                vaseSize: prod.size,
                filamentId: prod.filamentId,
                quantity: prod.quantity,
            });
        });
        const orderObj = {
            selectedVasesArray: selectedProductsForOrder,
            customerName: orderAttachments.storeName,
            comment: orderAttachments.comments,
        };
        const newOrder = await orderService.createOrder(orderObj);
        if (newOrder.error) {
            notificationHandler.error(newOrder.error.message);
            return;
        }
        console.log('order placed');
        Cookies.remove('cart');
        setSelectedProducts([]);
        handleCloseConfirmDialog();
        notificationHandler.success(snackOrderPlaced);
    };

    if (!filaments || !vases || !selectedProducts)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );

    if (vases && vases.length === 0) return <h1>No Vases</h1>;
    return (
        <div className="order-page">
            <div className="products">
                <VaseOrderList vases={vases} handleOpen={handleOpen} />
            </div>
            <div className="cart">
                <Cart
                    removeProduct={onRemoveProduct}
                    selectedProducts={selectedProducts}
                    onPlaceOrder={onPlaceOrder}
                />
            </div>

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
                                    {modalContent.size} size -{' '}
                                    {modalContent.dimensions}
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
                                            <React.Fragment key={filament._id}>
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
                                                <ReactTooltip id={filament._id}>
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
                                />
                            </div>
                            <Button
                                className="add-to-cart-btn"
                                onClick={onAddToCart}
                                className="addtocart"
                                variant="contained"
                                style={{ width: '150px' }}
                            >
                                Add to cart
                            </Button>
                        </div>
                        <img src={modalContent.image} />
                    </div>
                </Box>
            </Modal>
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


            <Dialog
                open={openWelcomeDialog}
                onClose={handleCloseWelcomeDialog }
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={dialogStyle}
                fullWidth
                TransitionComponent={Transition}
                // style={{backgroundImage: `url(https://res.cloudinary.com/echoshare/image/upload/v1642465658/Cubee3D/61995740_2245317985550489_7473695634269143040_n_pr2m2w.jpg)`}}
            >
                <DialogTitle id="alert-dialog-title">
                    {`Hello ${store} TLV!`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We are happy you are here.
                        <br/>
                        In this page you can choose your vases.
                        <br/>
                         press on the desired size, and a popup will show.
                    </DialogContentText>
                    <br />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseWelcomeDialog}>
                        <DoubleArrowIcon />
                        Let's Start
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

