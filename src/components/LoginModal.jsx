import { modalActions } from "@/app/store/modal";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
const { useDispatch, useSelector } = require("react-redux");

const LoginModal = () => {
  const dispatch = useDispatch();
  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);

  const handleOpenRegister = () => {
    dispatch(modalActions.closeLoginModal());
    dispatch(modalActions.openRegisterModal());
  };

  return (
    <Modal
      className="login-modal"
      open={isLoginModalOpen}
      onClose={() => dispatch(modalActions.closeLoginModal())}
    >
      <h2 className="text-xl font-bold mb-4 text-center">User Login</h2>
      <form className="login-form">
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
          <Button onClick={() => dispatch(modalActions.closeLoginModal())}>
            Cancel
          </Button>
          <button type="submit" className="submit-button">
            Login
          </button>
        </div>
      </form>
      <p className="text-center mt-4">
        Haven't registered yet?{" "}
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
