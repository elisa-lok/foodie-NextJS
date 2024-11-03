import Modal from "@/components/UI/Modal";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { useState } from "react";
import { currencyFormatter } from "@/utils/formatter";
import { modalActions } from "@/app/store/modal";
import { useDispatch, useSelector } from "react-redux";
import { saveOrderInfo, clearOrderInfo } from "@/app/store/order";
import { checkUserLogin } from "@/utils/auth";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  const isCheckoutModalOpen = useSelector(
    (state) => state.modal.isCheckoutModalOpen
  );

  const savedOrderInfo = useSelector((state) => state.order.orderInfo);
  const [pickupMethod, setPickupMethod] = useState("0"); // 0: Delivery, 1: Pickup
  const [selectedStore, setSelectedStore] = useState("");
  const [error, setError] = useState({ email: "", phone: "" });

  const initialEmail = JSON.parse(localStorage.getItem("user"))?.email || "";
  const initialAddress = localStorage.getItem("selectedAddress") || "";

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const isValidPhone = (phone) =>
    /^(\+?\d{1,4}[-.\s]?|\()?(\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/.test(phone);

  const submitOrder = async (event) => {
    event.preventDefault();

    const email = event.target.email.value || initialEmail;
    const phone = event.target.phone.value;
    let formIsValid = true;

    if (!isValidEmail(email)) {
      setError((prev) => ({ ...prev, email: "Please enter a valid email." }));
      formIsValid = false;
    } else {
      setError((prev) => ({ ...prev, email: "" }));
    }

    if (!isValidPhone(phone)) {
      setError((prev) => ({
        ...prev,
        phone: "Please enter a valid phone number.",
      }));
      formIsValid = false;
    } else {
      setError((prev) => ({ ...prev, phone: "" }));
    }

    if (!formIsValid) return;

    const orderInfo = {
      name: event.target.name.value,
      phone: phone,
      email: email,
      address:
        pickupMethod === "1"
          ? selectedStore
          : event.target.address.value || initialAddress,
      instructions: event.target.instructions.value,
      cartItems,
      totalPrice,
      pickupMethod: pickupMethod,
    };

    const token = localStorage.getItem("token");
    const response = await checkUserLogin(token);
    if (!token || !response.data.user) {
      alert("Please login first!");
      dispatch(saveOrderInfo(orderInfo));
      dispatch(modalActions.closeCheckoutModal());
      dispatch(modalActions.openLoginModal());
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const newData = { ...orderInfo, userId: user.id };
    try {
      const response = await axios.post("/api/order", newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        alert("Order submitted successfully!");
        dispatch(clearOrderInfo());
        dispatch(modalActions.closeCheckoutModal());
        router.push(`/payment?orderId=${response.data.orderId}`);
      } else {
        alert("Failed to submit order!");
        //alert(response.data.error);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order!");
      //alert(error);
    }
  };

  return (
    <Modal
      className="checkout"
      open={isCheckoutModalOpen}
      onClose={() => dispatch(modalActions.closeCheckoutModal())}
    >
      <form onSubmit={submitOrder}>
        {/* <h2>Checkout</h2> */}
        <p>Total Amount: {currencyFormatter.format(totalPrice)} </p>
        <div className="control-row">
          <Input
            label="Name"
            type="text"
            id="name"
            defaultValue={savedOrderInfo?.name || ""}
            style={{ width: "150px" }}
          />
          <Input
            label="Phone Number"
            type="text"
            id="phone"
            defaultValue={savedOrderInfo?.phone || ""}
            style={{ width: "250px" }}
          />
          {error.phone && <p style={{ color: "red" }}>{error.phone}</p>}
        </div>

        <Input
          label="Email"
          type="text"
          id="email"
          defaultValue={savedOrderInfo?.email || initialEmail}
          style={{ maxWidth: "420px" }}
        />
        {error.email && <p style={{ color: "red" }}>{error.email}</p>}

        <p style={{ marginBottom: "10px" }}>
          <label htmlFor="pickupMethod" style={{ fontWeight: "bold" }}>
            Pickup Method:
          </label>
          <select
            id="pickupMethod"
            name="pickupMethod"
            value={pickupMethod}
            onChange={(e) => setPickupMethod(e.target.value)}
            required
          >
            <option value="0">Delivery</option>
            <option value="1">Pickup</option>
          </select>
        </p>

        {pickupMethod === "1" && (
          <>
            <label htmlFor="store" style={{ fontWeight: "bold" }}>
              Select Store:
            </label>
            <select
              id="store"
              name="store"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              required
            >
              <option value="">Select a store</option>
              <option value="Store 1">Store 1</option>
              <option value="Store 2">Store 2</option>
              <option value="Store 3">Store 3</option>
            </select>
          </>
        )}

        {pickupMethod === "0" && (
          <>
            <Input
              label="Delivery Address"
              type="text"
              id="address"
              defaultValue={savedOrderInfo?.address || initialAddress}
              style={{ maxWidth: "600px" }}
            />

            <p className="control">
              <label htmlFor="instructions" style={{ fontWeight: "bold" }}>
                Delivery Instructions
              </label>
              <input
                id="instructions"
                name="instructions"
                defaultValue={savedOrderInfo?.instructions || ""}
                style={{ maxWidth: "600px" }}
              />
            </p>
          </>
        )}
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
