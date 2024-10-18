import dbConnect from '@/utils/db';
import User from '@/app/models/User';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function PUT(req) {
  try {
    const { email, nickname, avatar } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        status: 404,
        error: "User not found.",
      });
    }

    user.nickname = nickname || user.nickname || "";
    user.avatar = avatar || user.avatar || "";

    if (avatar) {
      const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const avatarFilename = `${uuidv4()}.png`;
      const avatarPath = path.join(process.cwd(), 'public', 'uploads', avatarFilename);

      fs.writeFileSync(avatarPath, buffer);

      const avatarUrl = `/uploads/${avatarFilename}`;
      user.avatar = avatarUrl;
    }

    await user.save();

    return NextResponse.json({ status: 200, message: 'User updated successfully', nickname: user.nickname, avatar: user.avatar});
  } catch (error) {
    return NextResponse.json({ status: 500, error: error})
  }
}