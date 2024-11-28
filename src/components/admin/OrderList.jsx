import { useState, useEffect } from "react";
import axios from "axios";
import {
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  ORDER_STATUSES,
} from "@/constants/payment";
import Pagination from "@/components/UI/Pagination";
import Modal from "@/components/UI/Modal";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("admin_token");

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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDetailsClick = (order) => {
    alert(1111);
    setSelectedOrder(order);
    setIsModalOpen(true);
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
                    <button onClick={() => handleDetailsClick(order)}>
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

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <h2>Order Details</h2>
          {selectedOrder && (
            <div>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedOrder.name}
              </p>
              <p>
                <strong>Order Status:</strong>{" "}
                {ORDER_STATUSES[selectedOrder.orderStatus]}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {PAYMENT_STATUSES[selectedOrder.paymentStatus]}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {PAYMENT_METHODS[selectedOrder.paymentMethod]}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default OrderList;
