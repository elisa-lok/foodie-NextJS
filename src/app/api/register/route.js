import dbConnect from '@/utils/db';
import User from '@/app/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { sendActivationEmail } from '@/utils/email';
import { createActivationLink } from '@/utils/token';

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

    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return NextResponse.json(
        {
          status: 400,
          error: "User already exists."
        }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      status: 'inactive',
      createTime: new Date(),
      lastLogin: null,
    })

    await newUser.save();

    const activationLink = createActivationLink(newUser._id);
    await sendActivationEmail(email, activationLink);

    return NextResponse.json(
      {
        status: 200,
        message: "User registered successfully, please check your email to activate your account.",
      }
    );


  }catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: "Failed to visit",
      }
    )
  }
}