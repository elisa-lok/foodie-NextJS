import React from "react";
import AccountInfo from "./AccountInfo";

const AccountContent = ({ selectedTab, user }) => {
  const renderContent = () => {
    if (!user) {
      return <p>No user data available.</p>;
    }

    switch (selectedTab) {
      case "info":
        return <AccountInfo user={user} />;
      case "password":
        return <p>Change your password here.</p>;
      case "orders":
        return <p>Here are your orders.</p>;
      case "favorites":
        return <p>These are your favorite items.</p>;
      case "recent":
        return <p>Items you have recently viewed.</p>;
      case "reviews":
        return <p>Your reviews are listed here.</p>;
      case "logout":
        return <p>You have logged out.</p>;
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
