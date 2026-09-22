import express from "express";

import verifyToken from "../Middleware/verifyToken.js";

import {
    createOrder,
    verifyPayment,
    getMyOrders,
     getAllOrders,
     updateOrderStatus
} from "../Controllers/OrderController.js";

const router = express.Router();

// =====================================
// CREATE ORDER
// =====================================

router.post(
"/create",
verifyToken,
createOrder
);
router.get(
    "/my-orders",
    verifyToken,
    getMyOrders
);

router.get(
    "/all-orders",
    verifyToken,
    getAllOrders
);

// =====================================
// VERIFY PAYMENT
// =====================================

router.post(
"/verify-payment",
verifyToken,
verifyPayment
);

router.put(
  "/update-status/:id",
  verifyToken,
  updateOrderStatus
);

export default router;
