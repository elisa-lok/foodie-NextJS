import dbConnect from '@/utils/db';
import Meals from '@/app/models/Meals';
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await dbConnect();
    const meals = await Meals.find({});
    return NextResponse.json(
      meals
    )
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: 500
      }
    )
  }
}