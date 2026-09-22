// import express from 'express'
// import verifyToken from '../Middleware/verifyToken.js'
// // import { isAdmin } from '../Middleware/verifyToken.js';
// const router = express.Router();

// import {
//     addToCart,
//     getCart,
//     updateQuantity,
//     deleteCartItem,
//     removeCart
// } from '../Controllers/CartController.js'


// router.post('/add',verifyToken, addToCart)
// router.get('/get',verifyToken, getCart)
// router.put('/update',verifyToken, updateQuantity )
// // router.delete("/remove",verifyToken,removeCart);
// router.delete( "/remove/:productId", verifyToken, deleteCartItem );



// export default router;
import express from "express";
import verifyToken from "../Middleware/verifyToken.js";

import {
  addToCart,
  getCart,
  updateQuantity,
  deleteCartItem,
  removeCart,
} from "../Controllers/CartController.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);

router.get("/get", verifyToken, getCart);

router.put("/update", verifyToken, updateQuantity);

router.delete("/remove/:productId", verifyToken, deleteCartItem);

router.delete("/remove", verifyToken, removeCart);

export default router;