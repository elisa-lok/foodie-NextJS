import dbConnect from '@/utils/db';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createToken } from '@/utils/token';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          status: 400,
          error: "Email and password are required."
        }
      )
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          status: 404,
          error: "User not found."
        }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          status: 401,
          error: "Invalid credentials.",
        }
      )
    }

    user.lastLogin = new Date();
    await user.save();

    const token = createToken(user._id);
    if(!token) {
      return NextResponse.json(
        {
          status: 500,
          error: "Failed to generate token.",
        }
      )
    } 
    
    return NextResponse.json({
      status: 200,
      message: 'Account Logins successfully.',
      token: token,
    })

  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: "Failed to visit login",
      }
    )
  }
}