import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState("");

  useEffect(() => {
    if (router.pathname) {
      if (router.pathname.includes("users")) {
        setSelectedSection("Users");
      } else if (router.pathname.includes("products")) {
        setSelectedSection("Products");
      } else if (router.pathname.includes("orders")) {
        setSelectedSection("Orders");
      } else if (router.pathname.includes("reviews")) {
        setSelectedSection("Reviews");
      } else if (router.pathname.includes("settings")) {
        setSelectedSection("Settings");
      } else {
        setSelectedSection("Overview");
      }
    }
  }, [router.pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure to logout?")) {
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="pizza-icon">🍕</i>
        <h3>Level One Pizza</h3>
      </div>
      <nav>
        <ul>
          <li
            className={selectedSection === "Overview" ? "active" : ""}
            onClick={() => setSelectedSection("Overview")}
          >
            <Link href="/admin/overview">Overview</Link>
          </li>
          <li
            className={selectedSection === "Users" ? "active" : ""}
            onClick={() => setSelectedSection("Users")}
          >
            <Link href="/admin/users">Manage Users</Link>
          </li>
          <li
            className={selectedSection === "Products" ? "active" : ""}
            onClick={() => setSelectedSection("Products")}
          >
            <Link href="/admin/products">Products</Link>
          </li>
          <li
            className={selectedSection === "Orders" ? "active" : ""}
            onClick={() => setSelectedSection("Orders")}
          >
            <Link href="/admin/orders">Orders</Link>
          </li>
          <li
            className={selectedSection === "Reviews" ? "active" : ""}
            onClick={() => setSelectedSection("Reviews")}
          >
            <Link href="/admin/reviews">Reviews</Link>
          </li>
          <li
            className={selectedSection === "Settings" ? "active" : ""}
            onClick={() => setSelectedSection("Settings")}
          >
            <Link href="/admin/settings">Settings</Link>
          </li>
          <li
            className={selectedSection === "Logout" ? "active" : ""}
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
