import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import app from './src/Server.js';
import connectDB from "./src/database/db.js";
import userRoute from './src/Routes/userRoute.js'
import productRoute from './src/Routes/productRoute.js'
import cartRoute from './src/Routes/CartRoute.js'
import cors from 'cors'
import orderRoutes from './src/Routes/OrderRoute.js'
import WishRoute from './src/Routes/WishlistRoute.js'
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// export const serverURL = "http://localhost:5173"
export const serverURL = "http://localhost:5000";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cartverse-jade.vercel.app",
    ],
    credentials: true,
  })
);


app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)
app.use("/api/order", orderRoutes);
app.use("/api/wish-list", WishRoute);
// app.use('/api/email', verify)


connectDB();
app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
