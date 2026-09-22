import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Products inside the order
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // Order amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Tax
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Shipping charges
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Currency
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Razorpay details
    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;