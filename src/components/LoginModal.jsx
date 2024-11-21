import { modalActions } from "@/app/store/modal";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const dispatch = useDispatch();
  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const savedOrderInfo = useSelector((state) => state.order.orderInfo);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleOpenRegister = () => {
    dispatch(modalActions.closeLoginModal());
    dispatch(modalActions.openRegisterModal());
  };

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    const response = await axios.post("/api/login", { email, password });
    if (response.data.status === 200) {
      console.log("Login successful:", response.data);

      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(modalActions.closeLoginModal());

      if (savedOrderInfo) {
        dispatch(modalActions.openCheckoutModal());
      } else {
        router.push("/");
      }
    } else {
      setError(response.data.error || "Login failed.");
    }
  };

  return (
    <Modal
      className="login-modal"
      open={isLoginModalOpen}
      onClose={() => dispatch(modalActions.closeLoginModal())}
    >
      <h2 className="text-xl font-bold mb-4 text-center">User Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form className="login-form" onSubmit={handleLoginForm}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" className="login-input" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            className="login-input"
            required
          />
        </div>
        <div className="login-actions">
          <Button
            type="button"
            onClick={() => dispatch(modalActions.closeLoginModal())}
          >
            Cancel
          </Button>
          <button type="submit" className="submit-button">
            Login
          </button>
        </div>
      </form>
      <p className="text-center mt-4">
        Haven&apos;t registered yet?
        <Button
          textButton
          onClick={handleOpenRegister}
          className="register-button"
        >
          Register here
        </Button>
      </p>
    </Modal>
  );
};

export default LoginModal;
