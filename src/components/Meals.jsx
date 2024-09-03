"use client";

import React, { useState, useEffect } from "react";
import MealItem from "./MealItem";
import Axios from "axios";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  useEffect(() => {
    const fetchMeals = async () => {
      const response = await Axios.get("/api/meals");
      const data = response.data;
      setMeals(data);
    };

    fetchMeals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {meals.map((meal) => (
          <MealItem key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default Meals;
