import Wishlist from "../Models/WishModel.js";
import Product from "../Models/productModel.js";

// ======================================
// ADD TO WISHLIST
// ======================================
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId,
                products: [{ productId }],
            });

            return res.status(201).json({
                success: true,
                message: "Product added to wishlist",
                wishlist,
            });
        }

        const alreadyExists = wishlist.products.some(
            (item) => item.productId.toString() === productId
        );

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist",
            });
        }

        wishlist.products.push({ productId });

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {
        console.log("ADD TO WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// ======================================
// GET WISHLIST
// ======================================
export const getWishlist = async (req, res) => {
    try {
        const userId = req.id;

        const wishlist = await Wishlist.findOne({ userId }).populate(
            "products.productId"
        );

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                totalItems: 0,
                wishlist: [],
            });
        }

        return res.status(200).json({
            success: true,
            totalItems: wishlist.products.length,
            wishlist: wishlist.products,
        });
    } catch (error) {
        console.log("GET WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// ======================================
// REMOVE FROM WISHLIST
// ======================================
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.products = wishlist.products.filter(
            (item) => item.productId.toString() !== productId
        );

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist,
        });
    } catch (error) {
        console.log("REMOVE WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// ======================================
// CLEAR WISHLIST
// ======================================
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.id;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found",
            });
        }

        wishlist.products = [];

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
        });
    } catch (error) {
        console.log("CLEAR WISHLIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};