import dbConnect from '@/utils/db';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function PUT(req) {
  try {
    const { id, currentPassword, newPassword } = await req.json();

    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({
        status: 404,
        error: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({
        status: 400,
        error: "Current password is incorrect.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({
      status: 200,
      message: "Password updated successfully.",
    });
  }catch(error) {
    return NextResponse.json({ status: 500, error: error})
  }
}