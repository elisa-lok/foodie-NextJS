import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "@/components/UI/Pagination";
import { useRouter } from "next/navigation";
import { checkAdminLogin } from "@/utils/auth";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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

      await fetchUsers(token);
    };

    initializeData();
  }, [router]);

  const fetchUsers = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/users", {
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

  const handleOpenConfirmModal = (userId, newStatus) => {
    const token = localStorage.getItem("admin_token");

    if (
      window.confirm(`Are you sure you want to set this user to ${newStatus}?`)
    ) {
      axios
        .put(
          `/api/admin/users/${userId}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status === 200) {
            fetchUsers();
          } else {
            setError(response.data.error || "Failed to update user status.");
          }
        })
        .catch((err) => {
          console.error("Error updating user status:", err);
          setError("An error occurred while updating user status.");
        });
    }
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
                <th>Actions</th>
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
                  <td>
                    {new Date(user.createTime).toISOString().split("T")[0]}
                  </td>
                  {user.lastLogin ? (
                    <td>
                      {new Date(user.lastLogin).toISOString().split("T")[0]}
                    </td>
                  ) : (
                    <td>Never logged in</td>
                  )}
                  <td>
                    <button
                      className="action-button"
                      onClick={() =>
                        handleOpenConfirmModal(
                          user._id,
                          user.status === "inactive" ? "active" : "inactive"
                        )
                      }
                    >
                      Set {user.status === "inactive" ? "Active" : "Inactive"}
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
