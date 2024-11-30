import { useState, useEffect } from "react";
import axios from "axios";
import {
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  ORDER_STATUSES,
} from "@/constants/payment";
import Pagination from "@/components/UI/Pagination";
import { currencyFormatter, formatDate } from "@/utils/formatter";
import { useRouter } from "next/navigation";
import { checkAdminLogin } from "@/utils/auth";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ordersPerPage = 10;

  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await checkAdminLogin(token);
      if (response.data.status !== 200) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      await fetchOrders(token);
    };

    initializeData();
  }, [router]);

  const fetchOrders = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/orders", {
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
      const response = await axios.get(`/api/admin/orders/${orderId}`, {
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
                    <button
                      onClick={() => handleDetailsClick(order._id)}
                      className="action-button"
                    >
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
              &times;
            </button>
            <div className="modal-header">
              <h2 className="modal-title">Order Details</h2>
            </div>
            <div className="modal-body">
              <div className="order-section">
                <p className="order-detail">
                  <span className="order-label">Order Number:</span>{" "}
                  {selectedOrder._id}
                </p>
                <p className="order-detail">
                  <span className="order-label">Recipient:</span>{" "}
                  {selectedOrder.name}
                </p>
                <p className="order-detail">
                  <span className="order-label">Email:</span>{" "}
                  {selectedOrder.email}
                </p>
                <p className="order-detail">
                  <span className="order-label">Phone:</span>{" "}
                  {selectedOrder.phone}
                </p>
                <p className="order-detail">
                  <span className="order-label">Order Type:</span>{" "}
                  {selectedOrder.pickupMethod === 0 ? "Delivery" : "Pickup"}
                </p>
                <p className="order-detail">
                  <span className="order-label">Address:</span>{" "}
                  {selectedOrder.address}
                </p>
                <p className="order-detail">
                  <span className="order-label">Order Status:</span>{" "}
                  {ORDER_STATUSES[selectedOrder.orderStatus]}
                </p>
                <p className="order-detail">
                  <span className="order-label">Payment Status:</span>{" "}
                  {PAYMENT_STATUSES[selectedOrder.paymentStatus]}
                </p>
                <p className="order-detail">
                  <span className="order-label">Payment Method:</span>{" "}
                  {PAYMENT_METHODS[selectedOrder.paymentMethod]}
                </p>
                <p className="order-detail">
                  <span className="order-label">Created At:</span>{" "}
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <div className="order-items-section">
                <h3 className="section-title">Items</h3>
                <ul className="order-items-list">
                  {selectedOrder.cartItems.map((item) => (
                    <li key={item.id} className="order-item">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-price">
                        {currencyFormatter.format(item.price)} x {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="order-total">
                <span className="order-label">Total Amount:</span>{" "}
                {currencyFormatter.format(selectedOrder.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
