import { modalActions } from "@/app/store/modal";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const RegisterModal = () => {
  const dispatch = useDispatch();
  const isRegisterModalOpen = useSelector(
    (state) => state.modal.isRegisterModalOpen
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match");
      return;
    }

    const response = await axios.post("/api/register", {
      email,
      password,
    });

    if (response.data.status === 200) {
      console.log("Registration successful:", response.data);
      setSuccessMessage(
        "Registration successful! Please check your email to activate your account."
      );

      setTimeout(() => {
        dispatch(modalActions.closeRegisterModal());
        setSuccessMessage("");
      }, 3000);
    } else {
      setError(response.data.error || "Failed to register user.");
    }
  };

  return (
    <Modal
      className="login-modal"
      open={isRegisterModalOpen}
      onClose={() => dispatch(modalActions.closeRegisterModal())}
    >
      <h2 className="text-xl font-bold mb-4 text-center">User Register</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && (
        <p className="text-black text-center bg-gray-200 p-4 rounded-md mb-4">
          {successMessage}
        </p>
      )}
      {!successMessage && (
        <form className="login-form" onSubmit={handleSubmitForm}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              className="login-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              name="confirm-password"
              value={confirmPassword}
              className="login-input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-actions">
            <Button onClick={() => dispatch(modalActions.closeRegisterModal())}>
              Cancel
            </Button>
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RegisterModal;
