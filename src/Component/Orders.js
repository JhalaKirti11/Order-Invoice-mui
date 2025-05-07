import React, { useState, useEffect } from 'react'
import axios from 'axios';

import {
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Modal,
    Box, Typography, Container, Card, CardContent, Grid, Divider, Rating, Stack, Pagination,
    TextField
} from '@mui/material';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import UploadIcon from '@mui/icons-material/Upload';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '90%',
    maxWidth: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export const Orders = () => {

    const [orderData, setOrderData] = useState({});
    const [userData, setUserData] = useState({});
    const [productData, setProductData] = useState([]);

    const [orderList, setOrderList] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [usersData, setUsersData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const handleClose = () => setOpenModal(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState([]);

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
    const currentOrders = orderList.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        let filtered = currentOrders;
        if (searchQuery) {
            filtered = filtered.filter((order) => order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.orderDate.includes(searchQuery)
            )
        }

        setFilters(filtered);
    }, [searchQuery, currentOrders])

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
                // console.log("Products data fetched successfully." + products.data.data);
                // console.log("productssss : " + JSON.stringify(products));
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

    return (
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
            <Typography align='center' sx={{ fontSize: 28, fontWeight: 700, textDecoration: 'underline', mb: 4 }}>Order List</Typography>

            <Box align='right' sx={{ mx: 6, my: 4 }}>
                <TextField id="outlined-basic" label="Search" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

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
                {/* <Table sx={{
                backgroundImage: 'linear-gradient(to bottom, rgba(255,153,153,0) 0%,rgba(255,153,153,0) 75%,rgba(255,153,153,1) 100%),
                    url(../assets/Sequential-order-number.png)', backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover', backgroundPosition: 'absolute', backgrounpacity:'50%'
            }}> */}
                <Box
                    sx={{
                        backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)),
                        url(../assets/101952-200.png)`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        borderRadius: 2,
                        // p: 3,
                        m: 2,
                    }}>

                    <Table>
                        <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
                            <TableRow>
                                <TableCell align="center"><strong>Order ID</strong></TableCell>
                                <TableCell align="center"><strong>User ID</strong></TableCell>
                                <TableCell align="center"><strong>Products</strong></TableCell>
                                <TableCell align="center"><strong>Total</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Date</strong></TableCell>
                                <TableCell align="center"><strong>Rating</strong></TableCell>
                                {/* <TableCell align="center"><strong>Export</strong></TableCell> */}
                                <TableCell align="center"><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filters.map((order) => (
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
                                    <TableCell align="center">₹{order.totalAmount}</TableCell>
                                    <TableCell align="center">{order.status}</TableCell>
                                    <TableCell align="center">{order.orderDate}</TableCell>
                                    <TableCell align="center">
                                        <Rating name="half-rating" defaultValue={2.5} precision={0.5} size="small" sx={{}} />
                                    </TableCell>
                                    {/* <TableCell align="center">
                                        <UploadIcon sx={{ color: '#898282' }} />
                                    </TableCell> */}

                                    {/* <TableCell align='center' spacing={1}>
                                <Rating name="half-rating" defaultValue={2.5} precision={0.5} size="small" />
                            </TableCell> */}
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

            {/* ========================================================================================================== */}

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
                            margin:0
                          }

                          #print-section, #print-section * {
                            visibility: visible;
                          }

                          #print-section {
                            position: absolute;
                            top: 10;
                            left: 10;
                            width: 80%;
                            }

                          button {
                            display: none;
                          }

                          .MuiModal-root {
                            all: initial;
                          }
                        }
                    `}
                    </style>

                    <Container maxWidth="sm">
                        <Typography align='center' sx={{ fontWeight: 600, fontSize: '20px', textDecoration: 'underline' }}>INVOICE</Typography>
                        <Grid container size={{ xs: 12, md: 12 }} spacing={2}>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <Card sx={{ border: 'none', boxShadow: 'none', ml: 2 }}>
                                    <CardContent>
                                        <Typography sx={{ color: 'text.secondary', fontWeight: 600, }}>
                                            Customer Details
                                        </Typography>
                                        {/* {console.log("Data : "+userData.name?.firstname)} */}
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
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'left' }} component="th" scope="row">
                                                    {product.id}
                                                </TableCell>
                                                <TableCell align="center" sx={{ fontSize: '12px', color: 'rgb(77 74 74 / 87%)', textAlign: 'left' }}> <img
                                                    // srcSet={product.image}
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
                                            {/* <TableCell rowSpan={2} /> */}
                                            {/* <TableCell colSpan={2}></TableCell> */}

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
                        <Button variant='contained' sx={{ mt: 3 }} onClick={() => window.print()}>Export</Button>
                    </div>
                </Box>
            </Modal>
        </Box >
    )
}