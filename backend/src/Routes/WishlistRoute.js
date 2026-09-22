import express from "express";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
} from "../Controllers/WishlistController.js";
import verifyToken  from "../Middleware/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, addToWishlist);
router.get("/", verifyToken, getWishlist);
router.delete("/remove/:productId", verifyToken, removeFromWishlist);
router.delete("/clear", verifyToken, clearWishlist);

export default router;