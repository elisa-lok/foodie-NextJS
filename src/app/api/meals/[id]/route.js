import dbConnect from '@/utils/db';
import Meals from '@/app/models/Meals';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = params; 

  try {
    const meal = await Meals.findOne({id: id});
    return NextResponse.json(
      meal
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: 'Failed to fetch meal',
      }
    )
  }
}
