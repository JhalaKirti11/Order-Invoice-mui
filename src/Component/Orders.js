import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Modal, Box, Typography, Container, Card, CardContent, Grid, Divider, Stack, Rating } from '@mui/material';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    // borderRadius: '8px',
    boxShadow: 24,
    padding: '30px 10px 30px 10px',
    // paddingBottom:'30px',
};

export const Orders = () => {
    const [orderData, setOrderData] = useState({});
    const [userData, setUserData] = useState({});
    const [productData, setProductData] = useState([]);

    const [orderList, setOrderList] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [usersData, setUsersData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    useEffect(() => {
        getOrderData();
        getProductData();
        getUserData();
    }, [])

    const getUserData = async () => {
        try {
            const users = await axios.get('https://fakeapi.net/users');
            if (users) {
                // console.log("Users data fetched successfully." + users.data.data);
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
                // console.log("Orders data fetched successfully." + order.data.data);
                setOrderList(order.data.data);
            } else {
                console.log("can not fetch the data");
            }
        } catch (error) {
            console.log("error : " + error)
        }
    }

    const getInvoice = (order) => {
        console.log("order invoice : " + order.id);
        setOrderData(order);
        const user = usersData.filter((user) => user.id === order.userId)
        setUserData(user[0]);
        console.log("Userdata : " + JSON.stringify(user));

        const detailedProducts = order.products.map((orderProduct) => {
            const productInfo = productsData.find((p) => p.id === orderProduct.productId);
            return {
                ...productInfo,
                quantity: orderProduct.quantity
            };
        });
        console.log("Product data : " + detailedProducts[0].image)
        setProductData(detailedProducts);
        setOpenModal(true);
    }

    return (
        <>
            <Typography align='center' sx={{ fontSize: '22px', fontWeight: 600, textDecoration: 'underline', my: 3 }}>Order List</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: '#b0b1b87d' }}>
                        <TableRow>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>OrderId</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>UserId</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Products</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Total Amount</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Order Date</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Rating</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Action</TableCell>
                            {/* action to see the invoice modal */}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderList.map((order) => (
                            <TableRow
                                key={order.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center" sx={{ fontSize: '15px' }} component="th" scope="row">
                                    {order.id}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '15px' }}>{order.userId}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '15px' }}>{order.products.map((product, index) => (
                                    <span key='index'>
                                        {product.productId} - {product.quantity}
                                        <br />
                                    </span>
                                ))}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '15px' }}>{order.totalAmount}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '15px' }}>{order.status}</TableCell>
                                <TableCell align="center" sx={{ fontSize: '15px' }}>{order.orderDate}</TableCell>
                                {/* <TableCell align='center'>
                                <StyledRating
                                    name="highlight-selected-only"
                                    defaultValue={3}
                                    IconContainerComponent={IconContainer}
                                    getLabelText={(value) => customIcons[value].label}
                                    highlightSelectedOnly
                                /></TableCell> */}

                                <TableCell align='center' spacing={1}>
                                    {/* <Stack spacing={1} align='center'> */}
                                    <Rating name="half-rating" defaultValue={2.5} precision={0.5} size="small" />
                                    {/* </Stack> */}
                                </TableCell>
                                <TableCell align="center" sx={{ fontSize: '15px' }}>
                                    <Button variant='contained' sx={{ backgroundColor: '#a09a9a', color: 'white' }} onClick={(() => getInvoice(order))}><RemoveRedEyeRoundedIcon /></Button></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Container maxWidth="sm">
                        <Typography align='center' sx={{ fontWeight: 600, fontSize: '20px', textDecoration: 'underline' }}>INVOICE</Typography>
                        <Grid container size={{ xs: 12, md: 12 }} spacing={2}>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <Card sx={{ width: 200, border: 'none', boxShadow: 'none', ml: 2 }}>
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
                            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 600, textDecoration: 'underline', color: 'text.secondary', mt: 5, ml: 4 }}>
                                Thank You! Have A Nice Day!
                            </Typography>
                        </Grid>
                    </Container>
                </Box>
            </Modal >
        </>
    )
}
