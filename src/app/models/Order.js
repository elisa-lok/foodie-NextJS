import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, validate: {
    validator: function (v) {
      return /^(\+?\d{1,4}[-.\s]?|\()?(\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/.test(v); 
    },
    message: props => `${props.value} is not a valid phone number!`
  } },
  email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address!'] },
  address: { type: String, required: true },
  instructions: { type: String },
  cartItems: [
    {
      id: { type: String, required: true },
      name: {type: String, required: true},
      price: {type: Number, required: true},
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderStatus: { type: Number, default: 0 },  // 0: "Pending",1: "Processing",2: "Completed",3: "Canceled",    
  paymentStatus: { type: Number, default: 0 }, // 0: "Unpaid",1: "Paid",2: "Refunded",3: "Failed"
  paymentMethod: { type: Number, default: 0}, // 0: "unpaid",1: "Credit Card",2: "Debit Card",3: "PayPal",4: "Apple Pay",5: "Google Pay",6: "Amazon Pay",7: "Venmo",8: "Other"
  paymentTime: { type: Date },
  deliveryStatus: { type: Number, default: 0 },  //  0: "Not Delivered",1: "Delivered",2: "In Transit",3: "Out for Delivery",4: "Delivery Failed"
  deliveryTime: { type: Date },
  pickupMethod: { type: Number, required: true },  // 0: Delivery, 1: Pickup
  pickupTime: { type: Date }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
