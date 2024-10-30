import Modal from "@/components/UI/Modal";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { currencyFormatter } from "@/utils/formatter";
import { modalActions } from "@/app/store/modal";
import { useDispatch, useSelector } from "react-redux";

export default function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  const isCheckoutModalOpen = useSelector(
    (state) => state.modal.isCheckoutModalOpen
  );

  return (
    <Modal
      className="checkout"
      open={isCheckoutModalOpen}
      onClose={() => dispatch(modalActions.closeCheckoutModal())}
    >
      <form>
        {/* <h2>Checkout</h2> */}
        <p>Total Amount: {currencyFormatter.format(totalPrice)} </p>

        <Input label="Name" type="text" id="name" />
        <Input label="Phone Number" type="text" id="phone" />
        <Input label="Email" type="text" id="email" />
        <Input label="Delivery Address" type="text" id="address" />
        <Input label="Delivery Instructions" type="text" id="instructions" />
        <p className="modal-actions">
          <Button
            type="button"
            textButton
            onClick={() => dispatch(modalActions.closeCheckoutModal())}
          >
            Close
          </Button>
          <Button>Submit Order</Button>
        </p>
      </form>
    </Modal>
  );
}
