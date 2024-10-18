import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AccountSidebar = ({ selectedTab, setSelectedTab }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const tabs = [
    { key: "info", label: "My Account Info" },
    { key: "password", label: "Change Password" },
    { key: "orders", label: "My Orders" },
    { key: "favorites", label: "Favorite Items" },
    { key: "recent", label: "Recently Viewed" },
    { key: "reviews", label: "My Reviews" },
    { key: "logout", label: "Logout", isLogout: true },
  ];

  const handleLogoutClick = () => {
    setSelectedTab("logout");
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    router.push("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className="account-sidebar w-64 p-6 pt-8 flex flex-col text-white border border-dashed border-gray-400/50 rounded-lg border-r-0">
        <ul className="space-y-4">
          {tabs.map(({ key, label, isLogout }) => (
            <li
              key={key}
              className={`cursor-pointer p-2 rounded-md hover:bg-yellow-500 ${
                selectedTab === key
                  ? "bg-yellow-400 text-black font-semibold"
                  : ""
              }`}
              onClick={() =>
                isLogout ? handleLogoutClick() : setSelectedTab(key)
              }
            >
              {label}
            </li>
          ))}
        </ul>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSidebar;
