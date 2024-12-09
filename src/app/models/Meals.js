import mongoose from "mongoose";

const MealsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: "" },
});

export default mongoose.models.Meals || mongoose.model("Meals", MealsSchema);
