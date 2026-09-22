import Cart from "../Models/cartModel.js";
import Product from "../Models/productModel.js";


// =====================================
// ADD PRODUCT TO CART
// =====================================

export const addToCart = async (req, res) => {
    try {

        const userId = req.id;

        console.log("CART USER ID:", userId);

        const { productId, quantity = 1 } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found"
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {

            cart = await Cart.create({
                userId,
                items: [
                    {
                        productId: product._id,
                        quantity: Number(quantity),
                        price: Number(product.productprice)
                    }
                ],
                totalPrice:
                    Number(product.productprice) * Number(quantity)
            });

        } else {

            const existingItem = cart.items.find(
                (item) =>
                    item.productId.toString() ===
                    productId.toString()
            );

            if (existingItem) {

                existingItem.quantity += Number(quantity);

            } else {

                cart.items.push({
                    productId: product._id,
                    quantity: Number(quantity),
                    price: Number(product.productprice)
                });
            }

            cart.totalPrice = cart.items.reduce(
                (total, item) =>
                    total +
                    Number(item.price) *
                    Number(item.quantity),
                0
            );

            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =====================================
// GET CART
// =====================================

export const getCart = async (req, res) => {

    try {

        const userId = req.id;


        const cart = await Cart.findOne({
            userId: userId
        }).populate("items.productId");


        if (!cart) {

            return res.status(200).json({

                success: true,

                message: "Cart is empty",

                cart: {
                    items: [],
                    totalPrice: 0
                }

            });

        }


        return res.status(200).json({

            success: true,

            cart

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Update CART
// =====================================

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;

        const { productId, quantity } = req.body;

        // Check productId
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Check quantity
        if (quantity === undefined || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find product inside cart
        const item = cart.items.find(
            (item) =>
                item.productId.toString() === productId.toString()
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        // Update quantity
        item.quantity = Number(quantity);

        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (total, item) => {
                return (
                    total +
                    Number(item.price) * Number(item.quantity)
                );
            },
            0
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.params;

        // Check productId
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Check if product exists in cart
        const itemExists = cart.items.some(
            (item) =>
                item.productId.toString() === productId.toString()
        );

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        // Remove product
        cart.items = cart.items.filter(
            (item) =>
                item.productId.toString() !== productId.toString()
        );

        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (total, item) => {
                return (
                    total +
                    Number(item.price) * Number(item.quantity)
                );
            },
            0
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const removeCart = async (req, res) => {
    try {
        const userId = req.id;

        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Empty cart
        cart.items = [];

        // Reset total price
        cart.totalPrice = 0;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart removed successfully",
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
