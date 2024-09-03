import mongoose from "mongoose";

const dbConnect = () => {
  try {
    const conn = mongoose.connect(`mongodb+srv://elisa:AaAa1234@foodie.cjkez.mongodb.net/foodie`, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: {conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default dbConnect;