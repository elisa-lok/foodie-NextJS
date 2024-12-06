import mongoose from "mongoose";

const MealsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

export default mongoose.models.Meals || mongoose.model("Meals", MealsSchema);
