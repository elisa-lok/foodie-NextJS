//import Modal from "@/components/UI/Modal.jsx";
import CartItem from "@/components/CartItem.jsx";
import { currencyFormatter } from "@/utils/formatter.js";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/app/store/modal";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  const dispatch = useDispatch();
  const isCartModalOpen = useSelector((state) => state.modal.isCartModalOpen);

  return (
    <Modal
      className="cart"
      open={isCartModalOpen}
      onClose={() => dispatch(modalActions.closeCartModal())}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={{
              id: item.id,
              title: item.name,
              quantity: item.quantity,
              total: item.totalPrice,
              price: item.price,
            }}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(totalPrice)}</p>
      <p className="modal-actions">
        <Button
          textButton
          onClick={() => dispatch(modalActions.closeCartModal())}
        >
          Close
        </Button>
        <Button onClick={() => dispatch(modalActions.openCheckoutModal())}>
          Go to Checkout
        </Button>
      </p>
    </Modal>
  );
}
