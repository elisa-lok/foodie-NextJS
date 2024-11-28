import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Pagination from "@/components/UI/Pagination";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("admin_token");

    try {
      setLoading(true);
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        setUsers(response.data.users);
      } else {
        setError(response.data.error || "Failed to fetch users.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                <th>Nickname</th>
                <th>Email</th>
                <th>Avatar</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.nick_name || "Pizza Lover"}</td>
                  <td>{user.email}</td>
                  <td>
                    <img
                      src={user.avatar || "/default_avatar.png"}
                      alt={user.nick_name}
                      style={{ width: "50px", borderRadius: "50%" }}
                    />
                  </td>
                  <td>{user.status}</td>
                  <td>{new Date(user.createTime).toLocaleString()}</td>
                  {user.lastLogin ? (
                    <td>{new Date(user.lastLogin).toLocaleString()}</td>
                  ) : (
                    <td>Never logged in</td>
                  )}
                  <td>
                    <button onClick={() => handleUpdate(user._id)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(users.length / usersPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default UserList;
