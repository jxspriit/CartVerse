import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    productname: {
      type: String,
      required: true,
      
    },

    productdesc: {
      type: String,
      required: true,
    },

    productImg: [
      {
        Url: {
          type: String,
          required: true,
        },

        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    productprice: {
      type: Number,
      
    },

    category: {
      type: String,
    },

    brand: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

