import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { InvoicePDF } from './InvoicePDF.js';
import {
TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Modal,
Box, Typography, Container, Card, CardContent, Grid, Divider, Rating, Stack, Pagination, FormLabel,
TextField, Radio, FormControlLabel, RadioGroup, MenuItem, Select
} from '@mui/material';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';

const style = {
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
maxWidth: 900,
bgcolor: 'background.paper',
boxShadow: 24,
p: 4,
};

export const OrdersComponent = () => {
const [orderData, setOrderData] = useState({});
const [userData, setUserData] = useState({});
const [productData, setProductData] = useState([]);
const [orderList, setOrderList] = useState([]);
const [productsData, setProductsData] = useState([]);
const [usersData, setUsersData] = useState([]);
const [openModal, setOpenModal] = useState(false);
const handleClose = () => setOpenModal(false);
const [openModal2, setOpenModal2] = useState(false);
const [filters, setFilters] = useState([]);
const [selectedUser, setSelectedUser] = useState('');
const [selectedOrder, setSelectedOrder] = useState('');
const [selectedPrice, setSelectedPrice] = useState('');
const [selectedStatus, setSelectedStatus] = useState('');
const [selectedDate, setSelectedDate] = useState('');
const [pdfShow, setPdfShow] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

useEffect(() => {
    getOrderData();
    getProductData();
    getUserData();
}, [])
const handlePageChange = (event, value) => {
    setCurrentPage(value);
};
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentOrders = filters.slice(indexOfFirstItem, indexOfLastItem);

useEffect(() => {
    let filtered = [...orderList];
    if (selectedUser) {
        console.log("user : " + selectedUser)
        filtered = filtered.filter(order => order.userId == selectedUser);
    }
    if (selectedOrder) {
        console.log("order : " + selectedOrder)
        filtered = filtered.filter(order => order.id == selectedOrder);
    }
    if (selectedStatus) {
        filtered = filtered.filter(order => order.status.toLowerCase().includes(selectedStatus.toLowerCase()));
    }
    if (selectedDate) {
        filtered = filtered.filter(order => order.orderDate.includes(selectedDate));
    }
    if (selectedPrice) {
        console.log("price : " + selectedPrice);
        const [min, max] = selectedPrice === '2000-max' ? [2000, Infinity] : selectedPrice.split('-').map(Number);
        console.log("min : " + min + ' max : ' + max)
        filtered = filtered.filter(product => product.totalAmount >= min && product.totalAmount < max);
    }
    setFilters(filtered);
}, [orderList, selectedUser, selectedOrder, selectedPrice, selectedStatus, selectedDate]);

useEffect(() => {
    let filtered = [...orderList]
})
const getUserData = async () => {
    try {
        const users = await axios.get('https://fakeapi.net/users');
        if (users) {
            setUsersData(users.data.data);
        }
    } catch (error) {
        console.log("error : " + error)
    }
}
const getProductData = async () => {
    try {
        const products = await axios.get('https://fakeapi.net/products');
        if (products) {
            setProductsData(products.data.data);
        } else {
            console.log("can not fetch the data");
        }
    } catch (error) {
        console.log("error : " + error)
    }
}
const getOrderData = async () => {
    try {
        const order = await axios.get('https://fakeapi.net/orders');
        if (order) {
            setOrderList(order.data.data);
        } else {
            console.log("can not fetch the data");
        }
    } catch (error) {
        console.log("error : " + error)
    }
}

const getInvoice = (order) => {
    setOrderData(order);
    const user = usersData.find((user) => user.id === order.userId);
    setUserData(user);

    const detailedProducts = order.products.map((orderProduct) => {
        const productInfo = productsData.find((p) => p.id === orderProduct.productId);
        return {
            ...productInfo,
            quantity: orderProduct.quantity
        };
    });
    setProductData(detailedProducts);
    setOpenModal(true);
}


const onButtonClick = () => {
    console.log("onButtonClick start");
    setPdfShow(true);
};
return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
        <Typography align='center' sx={{ fontSize: 28, fontWeight: 700, textDecoration: 'underline', mb: 4 }}>Order List</Typography>

        <Box align='right' sx={{ mx: 6, my: 4 }}>
            {/* <TextField id="outlined-basic" label="Search" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> */}
            <Button variant='contained' onClick={() => setOpenModal2(true)}>Filter</Button>

            {/* <TextField
                label="Search by Date"
                variant="outlined"
                // type="date"
                // InputLabelProps={{ shrink: true }}
                value={orderDateQuery}
                onChange={(e) => setOrderDateQuery(e.target.value)}
            /> */}
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Box
                sx={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.8)),
                        url(../assets/images.jpg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 2,
                    m: 2,
                }}>

                <Table>
                    <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
                        <TableRow>
                            <TableCell align="center"><strong>Order ID</strong></TableCell>
                            <TableCell align="center"><strong>User ID</strong></TableCell>
                            <TableCell align="center"><strong>Products</strong></TableCell>
                            <TableCell align="center"><strong>Total Amount</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Date</strong></TableCell>
                            <TableCell align="center"><strong>Rating</strong></TableCell>
                            <TableCell align="center"><strong>Action</strong></TableCell>
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {currentOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell align="center">{order.id}</TableCell>
                                <TableCell align="center">{order.userId}</TableCell>
                                <TableCell align="center">
                                    {order.products.map((product) => (
                                        <Typography key={product.productId} variant="body2">
                                            {product.productId} - {product.quantity}
                                        </Typography>
                                    ))}
                                </TableCell>
                                <TableCell align="center">{order.totalAmount}</TableCell>
                                <TableCell align="center">{order.status}</TableCell>
                                <TableCell align="center">{order.orderDate}</TableCell>
                                <TableCell align="center">
                                    <Rating name="half-rating" defaultValue={2.5} precision={0.5} size="small" sx={{}} />
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '15px' }}>
                                    <Button variant='contained' sx={{ backgroundColor: '#a09a9a', color: 'white' }} onClick={(() => getInvoice(order))}><RemoveRedEyeRoundedIcon /></Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Stack spacing={2} alignItems='flex-end' sx={{ mt: 3, mx: 4 }} >
                    <Pagination count={10} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" align='right' />
                </Stack>
            </Box>
        </TableContainer>
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box id="print-section" sx={style}>
                <style>
                    {`
                        @media print {
                          body * {
                            visibility: hidden;
                            margin:0;
                          }

                          #print-section, #print-section * {
                            visibility: visible;
                          }

                          #print-section {
                            position: absolute;
                            top: 10;
                            left: 10;
                            width: 110%;
                            border: 0px;
                            box-shadow: 0;
                            padding-left: 0px;
                            padding-right: 0px;
                          }

                            .css-zzzaw2-MuiContainer-root {
                                paddingLeft:0px;
                                paddingRight:0px;
                            }
                    
                          button {
                            display: none;
                          }
                        }
                    `}
                </style>
                <Container maxWidth="sm" sx={{ paddingLeft: '0px', paddingRight: '0px' }}>
                    <Typography align='center' sx={{ fontWeight: 600, fontSize: '20px', textDecoration: 'underline' }}>INVOICE</Typography>
                    <Grid container size={{ xs: 12, md: 12 }} spacing={2}>
                        <Grid size={{ xs: 6, md: 6 }}>
                            <Card sx={{ border: 'none', boxShadow: 'none', ml: 2 }}>
                                <CardContent>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 600, }}>
                                        Customer Details
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                                        {userData?.name?.firstname} - {userData?.name?.lastname}
                                    </Typography>

                                    <Typography component="div" sx={{ fontSize: '12px', color: 'text.secondary' }} >
                                        {userData?.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                                        {userData?.phone}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }}>
                            <Box align='right' sx={{ mt: 3, mr: 3 }}>
                                <Typography component="div" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    Order ID : <span sx={{ fontWeight: '500' }}>{orderData?.id}</span>
                                </Typography>
                                <Typography component="div" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    Order Date : <span sx={{ fontWeight: '500' }}>{orderData?.orderDate}</span>
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ mb: 3, mt: 2 }} />
                    <Grid size={{ xs: 6, md: 6 }}>
                        <TableContainer>
                            <Table sx={{ width: 'auto' }} aria-label="simple table">
                                <TableHead sx={{ backgroundColor: '#b0b1b87d' }}>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: '600' }}>ID</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: '600' }}>Image</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: '600' }}>Title</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: '600' }}>Brand</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: '600' }}>Quantity</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '14px', fontWeight: '600' }}>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productData.map((product) => (
                                        <TableRow
                                            key={product.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'left' }} component="th" scope="row">
                                                {product.id}
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'left' }}> <img
                                                src={product.image}
                                                alt={product.title}
                                                loading="lazy"
                                            /></TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'left' }}>{product.title}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'left' }}>{product.brand}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'center' }}>{product.quantity}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'left' }}>{product.price * product.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow align='right'>
                                        <TableCell colSpan={5} align='right' sx={{ fontWeight: 600, px: 6 }}>Total </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, }}>{orderData.totalAmount}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography align="center" sx={{ mt: 4, fontStyle: 'italic', color: 'gray' }}>
                            Thank You! Have a Nice Day!
                        </Typography>
                    </Grid>
                </Container>
                <div align='center'>
                    <Button variant='contained' sx={{ mt: 3 }} onClick={() => onButtonClick()}>Export</Button>

                    {pdfShow && (
                        <Box id='print-pdf' sx={{ display: 'none' }}>
                            <InvoicePDF
                                userData={userData}
                                orderData={orderData}
                                productData={productData}
                            />
                        </Box>
                    )}
                </div>
            </Box>
        </Modal>
        <Modal open={openModal2} onClose={() => setOpenModal2(false)}>
            <Card sx={{
                position: 'absolute',
                top: '50%',
                left: '80%',
                transform: 'translate(-50%, -50%)',
                width: 350,
                height: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 12,
                p: 3
            }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Filter Products</Typography>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: 15, mt: 2 }}>By Order ID</Typography>
                <TextField id="size-simple-select" label="Order ID" name='User ID' variant="outlined" size="small"
                    onChange={(e) => setSelectedOrder(e.target.value)} sx={{ width: 300 }} />
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: 15, mt: 2 }}>By User ID</Typography>
                <TextField id="size-simple-select" label="User ID" name='User ID' variant="outlined" size="small"
                    onChange={(e) => setSelectedUser(e.target.value)} sx={{ width: 300 }} />

                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: 15, mt: 2 }}>By Status</Typography>
                <Select
                    sx={{ width: 300 }}
                    label="Status"
                    labelId="size-select-label"
                    id="size-simple-select"
                    size="small"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <MenuItem key='delivered' value='delivered'>Delivered</MenuItem>
                    <MenuItem key='processing' value='processing'>Processing</MenuItem>
                </Select>
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: 15, mt: 2 }}>By Date</Typography>
                <TextField id="outlined-basic" label="Date" variant="outlined" size="small" onChange={(e) => setSelectedDate(e.target.value)} sx={{ width: 300 }} />
                <Typography gutterBottom sx={{ fontWeight: 600, fontSize: 15, mt: 2, mb: 0 }}>By Price</Typography>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="0-500" control={<Radio />} label="0 - 500" />
                    <FormControlLabel value="500-1000" control={<Radio />} label="500 - 1000" />
                    <FormControlLabel value="1000-1500" control={<Radio />} label="1000 - 1500" />
                    <FormControlLabel value="1500-2000" control={<Radio />} label="1500 - 2000" />
                    <FormControlLabel value="2000-max" control={<Radio />} label="2000 - max" />
                </RadioGroup>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenModal2(false)}>
                    Apply
                </Button>
                <Button variant="contained" sx={{ mt: 2, mx: 2 }} onClick={() => {
                    setSelectedUser('');
                    setSelectedOrder('');
                    setSelectedPrice('');
                    setSelectedStatus('');
                    setSelectedDate('');
                }}>
                    Reset
                </Button>
            </Card>
        </Modal>
    </Box >
);
};
