import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  instructions: { type: String },
  cartItems: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderStatus: { type: Number, default: 0 },  // 0: "Pending",1: "Processing",2: "Completed",3: "Canceled",    
  paymentStatus: { type: Number, default: 0 }, // 0: "Unpaid",1: "Paid",2: "Refunded",3: "Failed"
  paymentMethod: { type: Number, required: true }, // 0: "Cash",1: "Credit Card",2: "Debit Card",3: "PayPal",4: "Apple Pay",5: "Google Pay",6: "Amazon Pay",7: "Venmo",8: "Other"
  paymentTime: { type: Date },
  deliveryStatus: { type: Number, default: 0 },  //  0: "Not Delivered",1: "Delivered",2: "In Transit",3: "Out for Delivery",4: "Delivery Failed"
  deliveryTime: { type: Date },
  pickupMethod: { type: Number, required: true },  // 0: Delivery, 1: Pickup
  pickupTime: { type: Date }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
