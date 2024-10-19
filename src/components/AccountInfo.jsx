import React, { useEffect, useState } from "react";
import axios from "axios";

const AccountInfo = ({ user }) => {
  const [updatedUser, setUpdatedUser] = useState({
    email: user?.email || "",
    nickname: user?.nickname || "",
    avatar: user?.avatar || "",
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        email: user.email || "",
        nickname: user.nickname || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUpdatedUser({ ...updatedUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!updatedUser.email || !updatedUser.nickname || !updatedUser.avatar) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.put("/api/account", {
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        avatar: updatedUser.avatar,
      });
      if (response.data.status === 200) {
        const updatedUserInfo = {
          ...user,
          nickname: response.data.nickname,
          avatar: response.data.avatar,
        };

        localStorage.setItem("user", JSON.stringify(updatedUserInfo));
        console.log("User updated successfully:", response.data);
        setSuccessMsg("Account information updated successfully.");
      } else {
        setErrorMsg(response.data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMsg("Failed to update account information.");
    }
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <form className="account-info" onSubmit={handleSubmit}>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={updatedUser.email}
          readOnly
          className="form-input read-only"
        />
      </div>
      <div className="form-group">
        <label htmlFor="nickname">Nickname:</label>
        <input
          type="text"
          name="nickname"
          value={updatedUser.nickname}
          onChange={handleInputChange}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="avatar">Avatar:</label>
        <input
          type="file"
          name="avatar"
          onChange={handleAvatarChange}
          className="form-input"
        />
        {updatedUser.avatar && (
          <img
            src={updatedUser.avatar}
            alt="Avatar Preview"
            className="avatar-preview"
          />
        )}
      </div>
      <button type="submit" className="btn-save">
        Save Changes
      </button>
    </form>
  );
};

export default AccountInfo;
