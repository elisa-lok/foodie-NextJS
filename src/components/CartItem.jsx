import { useDispatch } from "react-redux";
import { cartActions } from "@/app/store/cart";
import { currencyFormatter } from "@/utils/formatter.js";
//import classes from "./CartItem.module.css";

const CartItem = (props) => {
  const dispatch = useDispatch();
  const { id, title, quantity, total, price } = props.item;

  const addItemHandler = () => {
    dispatch(
      cartActions.addItem({
        id,
        title,
        price,
      })
    );
  };

  const removeItemHandler = () => {
    dispatch(cartActions.removeItem(id));
  };

  return (
    <li className="cart-item">
      <p>
        {title} - {quantity} x {currencyFormatter.format(price)}
      </p>
      <p className="cart-item-actions">
        <button onClick={removeItemHandler}>-</button>
        <span>{quantity}</span>
        <button onClick={addItemHandler}>+</button>
      </p>
    </li>
  );
};

export default CartItem;
