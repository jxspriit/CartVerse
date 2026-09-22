import crypto from "crypto";
import Order from "../Models/OrderModel.js";
import Cart from "../Models/cartModel.js";
import Razorpayinstance from "../config/Razorpay.js";

// =====================================
// CREATE ORDER
// =====================================

export const createOrder = async (req, res) => {
try {
const userId = req.id;
    const {
        products,
        amount,
        tax = 0,
        shipping = 0,
        currency = "INR",
    } = req.body;

    // Check products
    if (
        !products ||
        !Array.isArray(products) ||
        products.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Products are required",
        });
    }

    // Check amount
    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Valid amount is required",
        });
    }

    // Create Razorpay order
    const razorpayOrder = await Razorpayinstance.orders.create({
        amount: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        receipt: `receipt_${Date.now()}`,
    });

    // Save order in MongoDB
    const order = await Order.create({
        userId,
        products,
        amount,
        tax,
        shipping,
        currency: currency.toUpperCase(),
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
        success: true,
        message: "Order created successfully",

        order: {
            id: order._id,
            userId: order.userId,
            products: order.products,
            amount: order.amount,
            tax: order.tax,
            shipping: order.shipping,
            currency: order.currency,
            status: order.status,
            razorpayOrderId: order.razorpayOrderId,
        },

        razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        },
    });

} catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
    });
}


};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.id;

        const orders = await Order.find({
            userId
        })
        .populate("products.productId")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {

        console.error("GET MY ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};
// =====================================
// VERIFY RAZORPAY PAYMENT
// =====================================

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("userId", "firstName lastName email phoneNo")
            .populate(
                "products.productId",
                "productname productprice productImg"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All orders fetched successfully",
            orders,
        });

    } catch (error) {

        console.error("GET ALL ORDERS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });

    }
};
export const verifyPayment = async (req, res) => {
try {
const userId = req.id;


    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    // Check payment details
    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {
        return res.status(400).json({
            success: false,
            message: "Payment details are required",
        });
    }

    // Find order belonging to logged-in user
    const order = await Order.findOne({
        userId,
        razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }

    // Generate Razorpay signature
    const generatedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_SECRET
        )
        .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature",
        });
    }

    // Save Razorpay payment details
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    // Update order status
    order.status = "processing";

    await order.save();

    // Clear user's cart
    const cart = await Cart.findOne({ userId });

    if (cart) {
        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();
    }

    return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order,
    });

} catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error: error.message,
    });
}

};
// =====================================
// UPDATE ORDER STATUS - ADMIN
// =====================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};