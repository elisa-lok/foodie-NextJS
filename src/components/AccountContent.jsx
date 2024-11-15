import React from "react";
import AccountInfo from "./AccountInfo";
import AccountPassword from "./AccountPassword";
import OrderList from "./OrderList";

const AccountContent = ({ selectedTab, user }) => {
  const renderContent = () => {
    if (!user) {
      return <p>No user data available.</p>;
    }

    switch (selectedTab) {
      case "info":
        return <AccountInfo user={user} />;
      case "password":
        return <AccountPassword userId={user.id} />;
      case "orders":
        return <OrderList userId={user.id} />;
      case "favorites":
        return <p>These are your favorite items.</p>;
      case "recent":
        return <p>Items you have recently viewed.</p>;
      case "reviews":
        return <p>Your reviews are listed here.</p>;
      case "logout":
        return <p>You can click logout button to log out the account!</p>;
      default:
        return <p>Select a tab to view content.</p>;
    }
  };

  return (
    <div className="account-content flex-1 p-10 border border-dashed border-gray-400/50 rounded-lg">
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default AccountContent;
