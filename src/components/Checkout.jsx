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
      open={isCheckoutModalOpen}
      onClose={() => dispatch(modalActions.closeCheckoutModal())}
    >
      <form>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(totalPrice)} </p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="Email" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

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
