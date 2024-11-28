import { useState, useEffect } from "react";
import axios from "axios";
import {
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  ORDER_STATUSES,
} from "@/constants/payment";
import Pagination from "@/components/UI/Pagination";
import { currencyFormatter, formatDate } from "@/utils/formatter"; 

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("admin_token");
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.error || "Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        console.log(response.data.order);
        setSelectedOrder(response.data.order);
        setIsModalOpen(true);
      } else {
        setError(response.data.error || "Failed to fetch order details.");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("An error occurred while fetching order details.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (orderId) => {
    alert(orderId);
    fetchOrderDetails(orderId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="user-list">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Buyer</th>
                <th>Order Status</th>
                <th>Payment Status</th>
                <th>Payment Method</th>
                <th>Order Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.name}</td>
                  <td>{ORDER_STATUSES[order.orderStatus]}</td>
                  <td>{PAYMENT_STATUSES[order.paymentStatus]}</td>
                  <td>{PAYMENT_METHODS[order.paymentMethod]}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleDetailsClick(order._id)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(orders.length / ordersPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {isModalOpen && selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              Close
            </button>
            <h2>Order Details</h2>
            <p>Order Number: {selectedOrder._id}</p>
            <p>Order Recipient: {selectedOrder.name}</p>
            <p>Email: {selectedOrder.email}</p>
            <p>Phone Number: {selectedOrder.phone}</p>
            <p>
              Order Handle:{" "}
              {selectedOrder.pickupMethod === 0 ? "Delivery" : "Pickup"}
            </p>
            <p>Address: {selectedOrder.address}</p>
            <p>Order Status: {ORDER_STATUSES[selectedOrder.orderStatus]}</p>
            <p>
              Payment Status: {PAYMENT_STATUSES[selectedOrder.paymentStatus]}
            </p>
            <p>
              Payment Method: {PAYMENT_METHODS[selectedOrder.paymentMethod]}
            </p>
            <p>Created At: {formatDate(selectedOrder.createdAt)}</p>

            <h2>Items</h2>
            <ul>
              {selectedOrder.cartItems.map((item) => (
                <li key={item.id} className="order-item">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-price">
                    {currencyFormatter.format(item.price)} x {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <p className="order-total">
              Total Amount: {currencyFormatter.format(selectedOrder.totalPrice)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
