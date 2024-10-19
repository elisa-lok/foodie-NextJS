import { useState } from "react";
import axios from "axios";

const AccountPassword = ({ userId }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      return;
    }

    const response = await axios.put("/api/password", {
      id: userId,
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });

    if (response.data.status === 200) {
      setSuccessMsg("Password changed successfully.");
      setErrorMsg(null);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setErrorMsg(response.data.error);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <form className="account-info" onSubmit={handleSubmit}>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password:</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword.currentPassword ? "text" : "password"}
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => togglePasswordVisibility("currentPassword")}
          >
            {showPassword.currentPassword ? "👁️" : "🙈"}
          </span>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">New Password:</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword.newPassword ? "text" : "password"}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => togglePasswordVisibility("newPassword")}
          >
            {showPassword.newPassword ? "👁️" : "🙈"}
          </span>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {showPassword.confirmPassword ? "👁️" : "🙈"}
          </span>
        </div>
      </div>
      <button type="submit" className="btn-save">
        Change Password
      </button>
    </form>
  );
};

export default AccountPassword;
