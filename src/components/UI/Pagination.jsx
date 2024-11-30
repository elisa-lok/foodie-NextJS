const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          style={{
            margin: "0 5px",
            padding: "8px 16px",
            backgroundColor: currentPage === number ? "#007bff" : "#fff",
            color: currentPage === number ? "#fff" : "#000",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
