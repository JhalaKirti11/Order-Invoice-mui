import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#eee',
    width: '16.6%',
    textAlign: 'center',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    width: '16.6%',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray',
  }
});

export const InvoicePDF = ({ userData, orderData, productData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Order Invoice</Text>

      <View style={styles.section}>
        <Text>Customer Name: {userData?.name?.firstname} {userData?.name?.lastname}</Text>
        <Text>Email: {userData?.email}</Text>
        <Text>Phone: {userData?.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text>Order ID: {orderData?.id}</Text>
        <Text>Order Date: {orderData?.orderDate}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>ID</Text>
          <Text style={styles.tableCellHeader}>Image</Text>
          <Text style={styles.tableCellHeader}>Title</Text>
          <Text style={styles.tableCellHeader}>Brand</Text>
          <Text style={styles.tableCellHeader}>Qty</Text>
          <Text style={styles.tableCellHeader}>Price</Text>
        </View>

        {productData.map((product) => (
          <View style={styles.tableRow} key={product.id}>
            <Text style={styles.tableCell}>{product.id}</Text>
            <Text style={styles.tableCell}>Image</Text>
            <Text style={styles.tableCell}>{product.title}</Text>
            <Text style={styles.tableCell}>{product.brand}</Text>
            <Text style={styles.tableCell}>{product.quantity}</Text>
            <Text style={styles.tableCell}>{product.price * product.quantity}</Text>
          </View>
        ))}

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}>Total</Text>
          <Text style={styles.tableCell}>{orderData?.totalAmount}</Text>
        </View>
      </View>

      <Text style={styles.footer}>Thank You! Have a Nice Day!</Text>
    </Page>
  </Document>
);