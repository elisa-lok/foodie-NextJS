"use client"; 

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/components/UI/Button";
import { currencyFormatter } from "@/utils/formatter";
import axios from "axios";

export default function Payment() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  const router = useRouter();
  const [orderInfo, setOrderInfo] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    },
    paymentSection: {
      display: "flex",
      maxWidth: "1000px",
      width: "100%",
      gap: "20px",
      padding: "30px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
    },
    leftBox: {
      flex: 1,
      padding: "20px",
      borderRight: "1px solid #ddd",
    },
    rightBox: {
      flex: 1,
      padding: "20px",
    },
    header: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#333",
    },
    method: {
      color: "#333",
    },
    orderInfo: {
      marginBottom: "20px",
      textAlign: "left",
    },
    orderText: {
      fontSize: "16px",
      margin: "8px 0",
      color: "#555",
    },
    itemList: {
      paddingLeft: "20px",
      listStyle: "disc",
      marginBottom: "16px",
    },
    item: {
      fontSize: "14px",
      color: "#333",
    },
    totalAmount: {
      fontSize: "18px",
      fontWeight: "600",
      marginTop: "10px",
      color: "#333",
    },
    button: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      fontWeight: "600",
      color: "#fff",
      backgroundColor: "#ffc404",
      borderRadius: "6px",
      cursor: "pointer",
      border: "none",
      outline: "none",
      transition: "background 0.3s ease",
      marginTop: "20px",
    },
    cardModal: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)", 
    },
    modalContent: {
      backgroundColor: "#fff", 
      opacity: 1,              
      padding: "20px",
      borderRadius: "8px",
      width: "400px",
      textAlign: "center",
    },
     
  };

  useEffect(() => {
    if (!orderId) {
      router.push("/"); 
      return;
    }

    const fetchOrderData = async () => {
      try {
        const orderResponse = await axios.get(`/api/order/${orderId}`);
        if (orderResponse.data.status !== 200) {
          router.push("/");
          return;
        }
        setOrderInfo(orderResponse.data.order);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const openCardModal = () => {
    setShowCardModal(true);
  };

  const closeCardModal = () => {
    setShowCardModal(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.paymentSection}>
        <div style={styles.leftBox}>
          <h2 style={styles.header}>Payment Details</h2>
          <p style={styles.method}>Select your payment method below:</p>
          <Button onClick={openCardModal} style={styles.button}>Debit/Credit Card</Button>
          <Button style={{ ...styles.button, backgroundColor: "#555" }}>PayPal</Button>
          {showCardModal && (
            <div style={styles.cardModal} onClick={closeCardModal}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>Add Card Details</h3>
                <input type="text" placeholder="Card Number" />
                <input type="text" placeholder="Expiry Date" />
                <input type="text" placeholder="CVV" />
                <Button onClick={closeCardModal} style={styles.button}>Save Card</Button>
              </div>
            </div>
          )}
          <p style={{ marginTop: "20px", color: "#666" }}>Note: Your payment information is securely handled.</p>
        </div>

        <div style={styles.rightBox}>
          <h2 style={styles.header}>Order Information</h2>
          {orderInfo && (
            <div style={styles.orderInfo}>
              <p style={styles.orderText}>Order recipient: {orderInfo.name}</p>
              <p style={styles.orderText}>Email: {orderInfo.email}</p>
              <p style={styles.orderText}>Phone number: {orderInfo.phone}</p>
              <p style={styles.orderText}>Order handle: {orderInfo.pickupMethod === 0 ? 'Delivery' : 'Pickup'}</p>
              <p style={styles.orderText}>Address: {orderInfo.address}</p>
              <p style={styles.orderText}>Items:</p>
              <ul style={styles.itemList}>
                {orderInfo.cartItems.map((item) => (
                  <li key={item.id} style={styles.item}>
                    {item.name} - {currencyFormatter.format(item.price)} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p style={styles.totalAmount}>Total Amount: {currencyFormatter.format(orderInfo.totalPrice)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
