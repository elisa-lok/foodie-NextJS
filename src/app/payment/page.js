"use client"; 

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import { currencyFormatter } from "@/utils/formatter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
      color: "#000",
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
    button: {
      marginTop: "20px",
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      fontWeight: "600",
      backgroundColor: "#ffc404",
      border: "none",
      cursor: "pointer",
      borderRadius: "6px",
    },
    modalContent: {
      position: "relative", 
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      opacity: 1,
      textAlign: "center",
    },
    closeButton: {
      position: "absolute",
      top: "-20px",
      right: "-10px",
      background: "none",
      border: "none",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333",
      cursor: "pointer",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      backgroundColor: "#fff", 
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

  const validateCardInfo = () => {
    const isValidCardNumber = (cardNumber) => {
      let sum = 0;
      let shouldDouble = false;
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      return sum % 10 === 0;
    };

    if (!isValidCardNumber(cardNumber)) {
      alert("Invalid card number.");
      return false;
    }
  
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      alert("Invalid expiry date format. Use MM/YY.");
      return false;
    }
  
    const [expMonth, expYear] = expiryDate.split("/").map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // YY format
    const currentMonth = currentDate.getMonth() + 1;
  
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      alert("Card has expired.");
      return false;
    }
  
    if (!/^\d{3,4}$/.test(cvv)) {
      alert("Invalid CVV.");
      return false;
    }
  
    return true;
  };

  const openPOLiPayment = async () => {
    try {
      const response = await axios.post("/api/payment/poli", { orderId }, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`,
      }});
      if (response.data && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error("Error initiating POLi payment:", error);
    }
  };

  const handleSaveCard = () => {
     if (!validateCardInfo()) return; 
  };

  return (
    <div style={styles.container}>
      <div style={styles.paymentSection}>
        <div style={styles.leftBox}>
          <h2 style={styles.header}>Payment Details</h2>
          <p style={styles.method}>Select your payment method below:</p>
          <Button onClick={openCardModal} style={styles.button}>Debit/Credit Card</Button>
          <Button onClick={openPOLiPayment} style={{ ...styles.button, backgroundColor: "#008080", color: "#fff" }}>POLi Payments</Button>
          <Button style={{ ...styles.button, backgroundColor: "#555", color: "#fff" }}>PayPal</Button>
          <Modal open={showCardModal} onClose={closeCardModal} className="card-modal">
            <div style={styles.modalContent}>
            <button onClick={closeCardModal} style={styles.closeButton}>×</button>
              <input type="text" placeholder="Card Number" style={styles.input} />
              <input type="text" placeholder="MM/YY" style={styles.input} />
              <input type="text" placeholder="CVV" style={styles.input} />
          <Button onClick={handleSaveCard} style={styles.button}>Save Card</Button>
          </div>
        </Modal>
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
