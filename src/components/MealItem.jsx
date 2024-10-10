import { currencyFormatter } from "@/utils/formatter";
import Button from "@/components/UI/Button.jsx";
import { useDispatch } from "react-redux";
import { cartActions } from "@/app/store/cart";

export default function MealItem({ meal }) {
  const dispatch = useDispatch();
  const { id, name, price } = meal;

  function addToCart() {
    dispatch(
      cartActions.addItem({
        id,
        name,
        price,
      })
    );
  }

  return (
    <li className="meal-item">
      <article>
        <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
        <div>
          <h3>{meal.name}</h3>
          <div className="meal-item-price">
            {currencyFormatter.format(meal.price)}
          </div>
          <p className="meal-item-description">{meal.description}</p>
        </div>
        <p className="meal-item-actions">
          <Button onClick={addToCart}>Add to cart</Button>
        </p>
      </article>
    </li>
  );
}
