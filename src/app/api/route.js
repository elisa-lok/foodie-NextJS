
import dbConnect from '../../utils/db';
import Meals from '../models/Meals';
import { NextResponse } from 'next/server'

export async function GET(req, res) {
  try {
    await dbConnect();
    const meals = await Meals.find({});
    return NextResponse.json(
      meals
    )
  } catch (error) {
    console.error(error);
    return NextRespone.json(
      {
        status: 500
      }
    )
  }
}

export async function POST(req, res) {
  try {
    await dbConnect();
    let data = await req.json();
    let user = await meals.findOne({ id: data.userData.id });

    if (!user) {
      return NextResponse.json({
        status: 500,
        error: "User Not Found" // Provide a more informative error message
      });
    }

    data.formData.author = user._id;
    // Use Mongoose's create method to save to database

    const newRecipe = await Recipe.create(
      data.formData
    );
    
    user.recipes.push(newRecipe);
    await user.save();

    return NextResponse.json({
      message: "Recipe created successfully",
      recipe: newRecipe // Optionally include the created recipe in the response
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: "Failed to create recipe" // Provide a more informative error message
    });
  }
}