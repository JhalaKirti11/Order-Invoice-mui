import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Modal, Box, Typography, Card, CardContent, Grid, Divider } from '@mui/material';
import CardActions from '@mui/material/CardActions';

import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const Orders = () => {
    const [orderData, setOrderData] = useState({});
    const [userData, setUserData] = useState({});
    const [productData, setProductData] = useState({});

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
        console.log("user   : " + user[0].name.firstname)
        setOpenModal(true);
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>OrderId</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>UserId</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Products</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Total Amount</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontSize: '17px', fontWeight: 600 }}>Order Date</TableCell>
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
                    <Box sx={{ display: 'flex' }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <Card sx={{ minWidth: 200 }}>
                                    <CardContent>
                                        {/* {console.log("Data : "+userData.name?.firstname)} */}
                                        <Typography sx={{ color: 'text.secondary', fontSize: '18px' }}>
                                            {userData?.name?.firstname} - {userData?.name?.lastname}
                                        </Typography>

                                        <Typography component="div" >
                                            {userData?.email}
                                        </Typography>
                                        <Typography variant="body2">
                                            {userData?.phone}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 6, md: 4 }}>
                                <Box>
                                    <Typography variant='h6' component="div" >
                                        {userData?.id}
                                    </Typography>
                                    <Typography variant='h6' component="div" >
                                        {userData?.orderDate}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid size={{ xs: 6, md: 4 }}>
                            <Button variant='contained' sx={{ backgroundColor: '#a09a9a', color: 'white' }}><RemoveRedEyeRoundedIcon /></Button>
                        </Grid>
                        <Grid size={{ xs: 6, md: 8 }}>
                            <Button variant='contained' sx={{ backgroundColor: '#a09a9a', color: 'white' }}><RemoveRedEyeRoundedIcon /></Button>
                        </Grid>

                    </Box>
                </Box>
            </Modal>

        </>
    )
}