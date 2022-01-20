// import {
//     Modal,
//     Slide,
//     Box,
//     Button,
//     TextField,
// } from '@mui/material';

// export const ProductOptionsModal = ({vaseObj, filaments}) =>{

//     const [open, setOpen] = useState(false);

//     //ModalContent is also the product choice for adding to cart
//     const [modalContent, setModalContent] = useState({
//         name: '',
//         type: '',
//         quantity: 1,
//         size: '',
//         selectedColor: '',
//         selectedColorId: '',
//         dimensions: '',
//         vaseId: '',
//     });

//     const handleOpen = vaseObj => {
//         setModalContent({ ...vaseObj, selectedColor: '' });
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setModalContent({
//             name: '',
//             type: '',
//             quantity: 1,
//             size: '',
//             selectedColor: '',
//             selectedColorId: '',
//             vaseId: '',
//             dimensions: '',
//         });
//         setOpen(false);
//     };

//     const onChangeQuantity = e => {
//         e.persist();
//         setModalContent(prevContent => {
//             return { ...prevContent, quantity: parseInt(e.target.value) };
//         });
//     };

//     const onColorChoose = colorObj => {
//         setModalContent(prevContent => {
//             return {
//                 ...prevContent,
//                 selectedColor: colorObj.color,
//                 selectedColorId: colorObj.colorId,
//             };
//         });
//     };

//     <Modal
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//             >
//                 <Box sx={style}>
//                     <div className="vase-choose-popup">
//                         <div className="inputs-submit">
//                             <div className="inputs">
//                                 <p>
//                                     {modalContent.name +
//                                         ' ' +
//                                         modalContent.type}
//                                 </p>
//                                 <p>
//                                     {modalContent.size} size -{' '}
//                                     {modalContent.dimensions}
//                                 </p>

//                                 <span>Choose Color:</span>
//                                 <div className="colors">
//                                     {filaments.map(filament => {
//                                         const isSelected =
//                                             modalContent.selectedColorId ===
//                                             filament._id
//                                                 ? 'selectedColor'
//                                                 : '';
//                                         return (
//                                             <React.Fragment key={filament._id}>
//                                                 <img
//                                                     data-tip
//                                                     data-for={filament._id}
//                                                     key={filament._id}
//                                                     onClick={() =>
//                                                         onColorChoose({
//                                                             color: filament.image,
//                                                             colorId:
//                                                                 filament._id,
//                                                         })
//                                                     }
//                                                     className={[
//                                                         'modal-filament-img',
//                                                         isSelected,
//                                                     ].join(' ')}
//                                                     src={filament.image}
//                                                 ></img>
//                                                 <ReactTooltip id={filament._id}>
//                                                     <span>
//                                                         {filament.color}
//                                                     </span>
//                                                 </ReactTooltip>
//                                             </React.Fragment>
//                                         );
//                                     })}
//                                 </div>
//                                 <br />
//                                 <TextField
//                                     onChange={onChangeQuantity}
//                                     defaultValue="1"
//                                     InputProps={{
//                                         inputProps: { min: 0, max: 10 },
//                                     }}
//                                     size="medium"
//                                     type="number"
//                                     id="quantity"
//                                     label="Quantity"
//                                     variant="outlined"
//                                 />
//                             </div>
//                             <Button
//                                 className="add-to-cart-btn"
//                                 onClick={onAddToCart}
//                                 className="addtocart"
//                                 variant="contained"
//                                 style={{ width: '150px' }}
//                             >
//                                 Add to cart
//                             </Button>
//                         </div>
//                         <img src={modalContent.image} />
//                     </div>
//                 </Box>
//             </Modal>
// }
