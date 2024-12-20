"use client";

import React, { useState, useEffect } from "react";
import MealItem from "./MealItem";
import axios from "axios";
import DeliveryPickupModal from "@/components/DeliveryPickupModal";

const Meals = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await axios.get("/api/meals");
      const data = response.data;
      setMeals(data);
    };

    fetchMeals();
  }, []);

  return (
    <>
      <DeliveryPickupModal />
      <ul id="meals">
        {meals.map((meal) => (
          <MealItem key={meal.id} meal={meal} />
        ))}
      </ul>
    </>
  );
};

export default Meals;
