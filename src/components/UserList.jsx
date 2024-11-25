import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="user-list">
      <h2>User List</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.nick_name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
