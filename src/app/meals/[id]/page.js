"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { cartActions } from '@/app/store/cart';
import Button from "@/components/UI/Button";
import { currencyFormatter } from "@/utils/formatter.js";
import axios from "axios";

export default function MealDetails() {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const { id } = params;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      margin: '0 auto',
      maxWidth: '600px', 
    },
    image: {
      width: '80%', 
      height: 'auto',
    },
    quantityContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0',
    },
    quantityButton: {
      margin: '0 5px',
      padding: '5px 10px',
      fontSize: '16px',
    },
    quantityText: {
      margin: '0 10px',
      fontSize: '16px',
    },
  };

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await axios.get(`/api/meals/${id}`);
        setMeal(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMealData();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id: meal.id,
        name: meal.name,
        price: meal.price,
        quantity, 
      })
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      return newQuantity < 1 ? 1 : newQuantity; 
    });
  };

  return (
    <div style={styles.container}>
      <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} style={styles.image} />
      <h1>{meal.name}</h1>
      <p>{meal.description}</p>
      <p>{currencyFormatter.format(meal.price)}</p>
      <div style={styles.quantityContainer}>
        <button onClick={() => handleQuantityChange(-1)} style={styles.quantityButton}>-</button>
        <span style={styles.quantityText}>{quantity}</span>
        <button onClick={() => handleQuantityChange(1)} style={styles.quantityButton}>+</button>
      </div>
      <Button onClick={addToCart}>Add to cart</Button>
    </div>
  );
}
