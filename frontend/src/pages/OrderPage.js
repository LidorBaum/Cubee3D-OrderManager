import React, { useEffect, useState, useContext, useRef } from 'react';
import { VaseOrderList } from '../cmps/VaseOrderList';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import {
    snackNoFilaments,
    snackNoVases,
    quantity0,
    noColorChosen,
} from '../snackMessages';
import ReactTooltip from 'react-tooltip';
import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import {
    Modal,
    Slide,
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import Cookies from 'js-cookie';
import vaseService from '../services/vaseService';
import filamentService from '../services/filamentService';
import { CartContext } from '../contexts/CartContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const dialogStyle = {
    mt: 2,
    minWidth: style.width,
};
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const OrderPage = props => {
    if (window.screen.width < 1000) {
        style.width = window.screen.width - 50;
        style.overflow = 'scroll';
        style.height = '85%';
        dialogStyle.maxWidth = 300;
        delete dialogStyle.minWidth;
    }
    const { cart, setCart } = useContext(CartContext);

    const [open, setOpen] = useState(false);
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
    const notificationHandler = useContext(SnackbarHandlerContext);
    const [vases, setVases] = useState(null);
    const [filaments, setFilaments] = useState(null);
    const [openWelcomeDialog, setWelcomeDialog] = useState(false);
    const [store, setStore] = useState('');

    useEffect(() => {
        const getVasesAndFilaments = async () => {
            let vases = await vaseService.getAllVases();
            if (vases.error) return notificationHandler.error(vases.error.message);
            vases = vases.filter(vase => vase.isAvailable)
            if (!vases.length) {
                notificationHandler.error(snackNoVases);
            }
            const arrangedVases = arrangeVasesByType(vases);
            let filamentsArray = await filamentService.getAllFilaments();
            if (filamentsArray.error)
                return notificationHandler.error(filamentsArray.error.message);
                filamentsArray = filamentsArray.filter(filament => filament.isAvailable)
            if (!filamentsArray.length) {
                notificationHandler.error(snackNoFilaments);
            }
            setVases(arrangedVases);
            setFilaments(filamentsArray);
            const searchQuery = new URLSearchParams(props.location.search);
            if (searchQuery.get('store')) {
                setWelcomeDialog(true);
                setStore(searchQuery.get('store'));
            }
        };
        getVasesAndFilaments();
    }, []);

    const arrangeVasesByType = vases => {
        let planter = vases.filter(vase => {
            return vase.type === 'Planter';
        });
        let bowl = vases.filter(vase => {
            return vase.type === 'Bowl';
        });
        let vase = vases.filter(vase => {
            return vase.type === 'Vase';
        });
        return {
            typeVase: vase,
            typePlanter: planter,
            typeBowl: bowl,
        };
    };

    const handleOpen = vaseObj => {
        setModalContent({ ...vaseObj, selectedColor: '' });
        setOpen(true);
    };

    const handleCloseWelcomeDialog = () => {
        setWelcomeDialog(false);
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

    const onColorChoose = colorObj => {
        setModalContent(prevContent => {
            return {
                ...prevContent,
                selectedColor: colorObj.color,
                selectedColorId: colorObj.colorId,
            };
        });
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
        for (let i = 0; i < cart.length; i++) {
            if (
                cart[i].vaseId === productToAdd.vaseId &&
                cart[i].filamentId === productToAdd.filamentId &&
                cart[i].size === productToAdd.size
            ) {
                cart[i].quantity = cart[i].quantity + productToAdd.quantity;
                isExist = true;
                break;
            }
        }
        if (!isExist)
            setCart(prevCart => {
                return [...prevCart, productToAdd];
            });
        const cartArr = [...cart, productToAdd];
        Cookies.set('cart', JSON.stringify(cartArr));
        handleClose();
    };

    let elRef = useRef(null);
    const useScroll = () => {
        window.scrollTo({ behavior: 'smooth', top: elRef.current - 100 });
    };

    if (!filaments || !vases)
        return (
            <div className="loader">
                <Hypnosis width="200px" height="200px" duration="3s" />
            </div>
        );

    return (
        <React.Fragment>
            <div className="quick-links">
            {vases.typePlanter.length > 0 && <Button variant="contained" style={{ textTransform: 'none' }}>
                    <a href="#planter">Planters</a>
                </Button> }
                {vases.typeVase.length > 0 && <Button variant="contained" style={{ textTransform: 'none' }}>
                    <a href="#vase">Vases</a>
                </Button> }
                {vases.typeBowl.length > 0 && <Button variant="contained" style={{ textTransform: 'none' }}>
                    <a href="#bowl">Bowls</a> 
                </Button> }
            </div>
            <div className="order-page">
                <div ref={elRef} id="planter" className="products">
                    {vases.typePlanter.length > 0 && <div className="type-list-container">
                        <h2>Planters</h2>
                        <VaseOrderList
                            vases={vases.typePlanter}
                            handleOpen={handleOpen}
                        />
                    </div>}
                    {vases.typeVase.length > 0 && <div ref={elRef} id="vase" className="type-list-container">
                        <h2>Vases</h2>
                        <VaseOrderList
                            vases={vases.typeVase}
                            handleOpen={handleOpen}
                        />
                    </div>}
                    {vases.typeBowl.length > 0 && <div ref={elRef} id="bowl" className="type-list-container">
                        <h2>Bowls</h2>
                        <VaseOrderList
                            vases={vases.typeBowl}
                            handleOpen={handleOpen}
                        />
                    </div> }
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
                                        className="quantity-field"
                                    />
                                </div>
                                <Button
                                    className="add-to-cart-btn addtocart"
                                    onClick={onAddToCart}
                                    variant="contained"
                                    style={{ width: '180px' }}
                                    disabled={
                                        modalContent.selectedColorId
                                            ? false
                                            : true
                                    }
                                >
                                    Add to cart
                                </Button>
                            </div>
                            <img src={modalContent.image} />
                        </div>
                    </Box>
                </Modal>

                <Dialog
                    open={openWelcomeDialog}
                    onClose={handleCloseWelcomeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={dialogStyle}
                    fullWidth
                    TransitionComponent={Transition}
                >
                    <DialogTitle id="alert-dialog-title">
                        {`Hello ${store} TLV!`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            We are happy you are here.
                            <br />
                            In this page you can choose your vases.
                            <br />
                            press on the desired size, and a popup will show.
                        </DialogContentText>
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={handleCloseWelcomeDialog}
                        >
                            <DoubleArrowIcon />
                            Let's Start
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </React.Fragment>
    );
};
