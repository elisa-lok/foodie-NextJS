import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "@/components/UI/Pagination";
import { currencyFormatter } from "@/utils/formatter";
import { useRouter } from "next/navigation";
import { checkAdminLogin } from "@/utils/auth";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const productsPerPage = 10;

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

      setToken(token);
      await fetchProducts(token);
    };

    initializeData();
  }, [router]);

  const fetchProducts = async (token) => {
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    if (!token) return;
    try {
      if (selectedProduct) {
        var response = await axios.put(
          `/api/admin/products/${selectedProduct._id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status !== 200) {
          throw new Error(response.data.error || "Failed to update product.");
        }
      } else {
        var response = await axios.post("/api/admin/products", productData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status !== 200) {
          throw new Error(response.data.error || "Failed to add new product.");
        }
      }
      handleModalClose();
      await fetchProducts(token);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (product) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `/api/admin/products/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status !== 200) {
          throw new Error(response.data.error || "Failed to delete product.");
        }
        await fetchProducts(token);
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <div className="user-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <>
          <div style={{ marginBottom: "20px", textAlign: "right" }}>
            <button
              onClick={handleAddNewProduct}
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
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => handleUpdate(product)}
                        className="action-button"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="action-button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={handleModalClose}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: product?.id || "",
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    image: product?.image || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: "20px" }}>
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Image:</label>
            <input type="file" name="image" onChange={handleFileChange} />
            {formData.image && (
              <img
                src={
                  formData.image.startsWith("data:")
                    ? formData.image
                    : `/${formData.image}`
                }
                alt="Image Preview"
                style={{ width: "80px", borderRadius: "50%" }}
              />
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">
              Save
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductList;
