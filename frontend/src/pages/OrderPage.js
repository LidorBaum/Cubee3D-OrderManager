import React, { useEffect, useState, useContext } from 'react';
import { VaseOrderList } from '../cmps/VaseOrderList';
// import { useHistory } from 'react-router-dom';
// import { CompanyContext } from '../contexts/CompanyContext';
// import { BoardEmployeeList } from '../cmps/BoardEmployeeList';
// import employeeService from '../services/employeeService';
// import io from 'socket.io-client';
// import Spin from 'react-cssfx-loading/lib/Spin';
// import Select from 'react-select';
import { SnackbarHandlerContext } from '../contexts/SnackbarHandlerContext';
import vaseService from '../services/vaseService';
import {
    snackNoFilaments,
    snackNoVases,
    quantity0,
    noColorChosen,
    productRemoved,
} from '../snackMessages';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

import Hypnosis from 'react-cssfx-loading/lib/Hypnosis';
import filamentService from '../services/filamentService';
import { Cart } from '../cmps/Cart';
import Modal from '@mui/material/Modal';
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

export const OrderPage = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = vaseObj => {
        setModalContent({ ...vaseObj, selectedColor: '' });
        setOpen(true);
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

    const notificationHandler = useContext(SnackbarHandlerContext);
    const [vases, setVases] = useState(null);
    const [filaments, setFilaments] = useState(null);
    const [isRefresh, setDoRefresh] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([
        // {
        //     vaseId: "XTZ",
        //     name: "Gusin",
        //     size: "Large",
        //     image: "https://res.cloudinary.com/echoshare/image/upload/v1642250618/Gusein_vase_1642080295590_ytwfxu.jpg",
        //     type: "Planter",
        //     color: "https://res.cloudinary.com/echoshare/image/upload/v1642253816/Cubee3D/Screenshot_6_ngaj8w.png",
        //     filamentId: "XYZ",
        //     quantity: 1
        // }
    ]);

    useEffect(() => {
        const getVasesAndFilaments = async () => {
            const vases = await vaseService.getAllVases();
            if (vases.error)
                return notificationHandler.error(vases.error.message);
            console.log(vases);
            if (!vases.length) {
                notificationHandler.error(snackNoVases);
            }
            const filamentsArray = await filamentService.getAllFilaments();
            if (filamentsArray.error)
                return notificationHandler.error(filamentsArray.error.message);
            console.log(filamentsArray);
            if (!filamentsArray.length) {
                notificationHandler.error(snackNoFilaments);
            }
            setVases(vases);
            setFilaments(filamentsArray);
        };
        getVasesAndFilaments();
    }, []);

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
        console.log(modalContent);
    };

    const onAddToCart = () => {
        let isExist = false;
        const productToAdd = {
            vaseId: modalContent.vaseId,
            name: modalContent.name,
            type: modalContent.type,
            size: modalContent.size,
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
        handleClose();
    };

    const onRemoveProduct = productIdentifier => {
        console.log(productIdentifier);
        setSelectedProducts(
            selectedProducts.filter(prod => {
                return (
                    prod.vaseId !== productIdentifier.vaseId &&
                    prod.filamentId !== productIdentifier.filamentId &&
                    prod.size !== productIdentifier.size
                );
            })
        );
        notificationHandler.success(productRemoved);
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
                />
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p>{modalContent.name + ' ' + modalContent.type}</p>
                    <p>
                        {modalContent.size} size - {modalContent.dimensions}
                    </p>

                    <span>Choose Color:</span>
                    <div className="colors">
                        {filaments.map(filament => {
                            const isSelected =
                                modalContent.selectedColorId === filament._id
                                    ? 'selectedColor'
                                    : '';
                            return (
                                <img
                                    key={filament._id}
                                    onClick={() =>
                                        onColorChoose({
                                            color: filament.image,
                                            colorId: filament._id,
                                        })
                                    }
                                    className={[
                                        'modal-filament-img',
                                        isSelected,
                                    ].join(' ')}
                                    src={filament.image}
                                ></img>
                            );
                        })}
                    </div>
                    <TextField
                        onChange={onChangeQuantity}
                        defaultValue="1"
                        InputProps={{ inputProps: { min: 0, max: 10 } }}
                        size="medium"
                        type="number"
                        id="quantity"
                        label="Quantity"
                        variant="outlined"
                    />
                    <br />
                    <Button
                        onClick={onAddToCart}
                        className="addtocart"
                        variant="contained"
                    >
                        Add to cart
                    </Button>
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography> */}
                </Box>
            </Modal>
        </div>
    );
};
