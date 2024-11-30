import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "@/components/UI/Pagination";
import { currencyFormatter } from "@/utils/formatter";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("admin_token");

    try {
      setLoading(true);
      const response = await axios.get("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setProducts(response.data.products);
      } else {
        setError(response.data.error || "Failed to fetch products.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdate = (productId) => {
    alert(productId);
  };

  return (
    <div className="user-list">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
          <div style={{ marginBottom: "20px", textAlign: "right" }}>
            <button
              onClick={() => handleAddNewProduct()}
              className="add-button"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add a New Product
            </button>
          </div>

          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Image</th>
                <th style={{ width: "600px" }}>Desc</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{currencyFormatter.format(product.price)}</td>
                  <td>
                    <img
                      src={`/${product.image}`}
                      alt={product.name}
                      style={{ width: "80px", borderRadius: "50%" }}
                    />
                  </td>
                  <td style={{ textAlign: "left" }}>{product.description}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="action-button"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(products.length / productsPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductList;
