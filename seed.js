import mongoose from "mongoose";
import bcrypt from "bcrypt"; 
import dotenv from "dotenv"; 

dotenv.config();

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};


const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);

const seedAdmins = async () => {
  try {
    await dbConnect();

    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash("AaAa1234", 10); 

    const admin = new Admin({
      email: "admin@example.com", 
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin created successfully!");
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmins();
