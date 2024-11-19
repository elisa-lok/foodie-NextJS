import { NextResponse } from 'next/server';
import Admin from '@/app/models/Admin';
import dbConnect from '@/utils/db';
import { createToken } from '@/utils/token';
import bcrypt from 'bcrypt';

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

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        {
          status: 404,
          error: "Admin not found."
        }
      )
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          status: 401,
          error: "Invalid credentials."
        }
      )
    }

    const token = createToken(admin._id);
    return NextResponse.json(
      {
        status: 200,
        message: "Admin logged in successfully.",
        token: token,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: "Failed to login",
      }
    )
  }
}