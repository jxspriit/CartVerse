// export default Cart;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowLeft,
    Tag,
    ShieldCheck,
    RotateCcw,
    Truck,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
    getCart,
    updateCartQuantity,
    removeFromCart,
} from "@/redux/CartSlice";

import { toast } from "sonner";


const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // =====================================
    // REDUX CART
    // =====================================

    const {
        cart = [],
        loading,
        error,
    } = useSelector((state) => state.cart);


    // =====================================
    // PROMO CODE
    // =====================================

    const [promoCode, setPromoCode] = useState("");
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState("");


    // =====================================
    // GET CART
    // =====================================

    useEffect(() => {

        dispatch(getCart());

    }, [dispatch]);


    // =====================================
    // CART ITEMS
    // =====================================

    const cartItems = Array.isArray(cart)
        ? cart
        : [];


    // =====================================
    // SUBTOTAL
    // =====================================

    const subtotal = cartItems.reduce(
        (total, item) => {

            const price = Number(
                item.price || 0
            );

            const quantity = Number(
                item.quantity || 0
            );

            return total + price * quantity;

        },
        0
    );


    // =====================================
    // SHIPPING
    // Free above ₹299
    // =====================================

    const shipping =
        subtotal >= 299
            ? 0
            : 50;


    // =====================================
    // GST 18%
    // =====================================

    const gst = subtotal * 0.18;


    // =====================================
    // PROMO CODE
    // =====================================

    const applyPromoCode = () => {

        const code =
            promoCode.trim().toUpperCase();


        if (!code) {

            setPromoDiscount(0);

            setPromoMessage(
                "Please enter a promo code."
            );

            return;
        }


        // SAVE10 = 10% discount

        if (code === "SAVE10") {

            const discount =
                subtotal * 0.10;

            setPromoDiscount(
                discount
            );

            setPromoMessage(
                "Promo code applied successfully!"
            );

        } else {

            setPromoDiscount(0);

            setPromoMessage(
                "Invalid promo code."
            );

        }

    };


    // =====================================
    // FINAL TOTAL
    // =====================================

    const total =
        subtotal +
        gst +
        shipping -
        promoDiscount;


    // =====================================
    // INCREASE QUANTITY
    // =====================================

    const increaseQuantity = async (item) => {

        const productId =
            item.productId?._id ||
            item.productId;


        try {

            await dispatch(
                updateCartQuantity({
                    productId,
                    quantity:
                        Number(item.quantity) + 1,
                })
            ).unwrap();

        } catch (error) {

            toast.error(
                error ||
                "Unable to update quantity"
            );

        }

    };


    // =====================================
    // DECREASE QUANTITY
    // =====================================

    const decreaseQuantity = async (item) => {

        if (
            Number(item.quantity) <= 1
        ) {
            return;
        }


        const productId =
            item.productId?._id ||
            item.productId;


        try {

            await dispatch(
                updateCartQuantity({
                    productId,
                    quantity:
                        Number(item.quantity) - 1,
                })
            ).unwrap();

        } catch (error) {

            toast.error(
                error ||
                "Unable to update quantity"
            );

        }

    };


    // =====================================
    // REMOVE PRODUCT
    // =====================================

    const handleRemove = async (item) => {

        const productId =
            item.productId?._id ||
            item.productId;


        try {

            await dispatch(
                removeFromCart(productId)
            ).unwrap();

            toast.success(
                "Product removed from cart"
            );

        } catch (error) {

            toast.error(
                error ||
                "Unable to remove product"
            );

        }

    };


    // =====================================
    // LOADING
    // =====================================

    if (
        loading &&
        cartItems.length === 0
    ) {

        return (

            <div className="min-h-screen pt-28 flex justify-center">

                <p className="text-gray-500">
                    Loading cart...
                </p>

            </div>

        );

    }


    // =====================================
    // ERROR
    // =====================================

    if (
        error &&
        cartItems.length === 0
    ) {

        return (

            <div className="min-h-screen pt-28 text-center">

                <p className="text-red-500">
                    {error}
                </p>

            </div>

        );

    }


    // =====================================
    // MAIN UI
    // =====================================

    return (

        <div className="bg-gray-50 min-h-screen pt-24 pb-12">

            <div className="max-w-7xl mx-auto px-4">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Shopping Cart
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Review your items before placing your order.
                    </p>

                </div>


                {/* =====================================
                    EMPTY CART
                ===================================== */}

                {cartItems.length === 0 ? (

                    <div className="bg-white border rounded-xl p-12 text-center">

                        <ShoppingBag
                            size={50}
                            className="mx-auto text-gray-400"
                        />

                        <h2 className="text-xl font-semibold mt-5">
                            Your cart is empty
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Add some products to your cart.
                        </p>


                        <Link to="/products">

                            <button
                                className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                            >
                                Continue Shopping
                            </button>

                        </Link>

                    </div>

                ) : (

                    <div className="grid lg:grid-cols-3 gap-8">


                        {/* =====================================
                            CART ITEMS
                        ===================================== */}

                        <div className="lg:col-span-2 space-y-4">

                            {cartItems.map((item) => {

                                const product =
                                    item.productId;


                                const productId =
                                    product?._id ||
                                    item.productId;


                                const productName =
                                    product?.productname ||
                                    "Product";


                                const productImage =
                                    product?.productImg?.[0]?.Url;


                                return (

                                    <div
                                        key={productId}
                                        className="bg-white border rounded-xl p-5"
                                    >

                                        <div className="flex gap-5">


                                            {/* IMAGE */}

                                            <div className="w-28 h-28 shrink-0 bg-gray-100 rounded-lg overflow-hidden">

                                                <img
                                                    src={
                                                        productImage ||
                                                        "https://via.placeholder.com/400x400?text=Product"
                                                    }
                                                    alt={productName}
                                                    className="w-full h-full object-cover"
                                                />

                                            </div>


                                            {/* DETAILS */}

                                            <div className="flex-1">

                                                <div className="flex justify-between gap-4">

                                                    <div>

                                                        <h2 className="font-semibold text-lg">
                                                            {productName}
                                                        </h2>


                                                        <p className="text-gray-500 mt-1">

                                                            ₹
                                                            {Number(
                                                                item.price || 0
                                                            ).toFixed(2)}

                                                        </p>

                                                    </div>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemove(item)
                                                        }
                                                        className="text-gray-400 hover:text-red-500"
                                                    >

                                                        <Trash2 size={20} />

                                                    </button>

                                                </div>


                                                {/* QUANTITY */}

                                                <div className="flex items-center justify-between mt-6">


                                                    <div className="flex items-center border rounded-lg">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                decreaseQuantity(item)
                                                            }
                                                            disabled={
                                                                Number(item.quantity) <= 1 ||
                                                                loading
                                                            }
                                                            className="p-2 hover:bg-gray-100 disabled:opacity-40"
                                                        >

                                                            <Minus size={16} />

                                                        </button>


                                                        <span className="px-4 font-medium">

                                                            {item.quantity}

                                                        </span>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                increaseQuantity(item)
                                                            }
                                                            disabled={loading}
                                                            className="p-2 hover:bg-gray-100 disabled:opacity-40"
                                                        >

                                                            <Plus size={16} />

                                                        </button>

                                                    </div>


                                                    {/* ITEM TOTAL */}

                                                    <p className="font-bold text-lg">

                                                        ₹
                                                        {(
                                                            Number(item.price || 0) *
                                                            Number(item.quantity || 0)
                                                        ).toFixed(2)}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })}


                            {/* CONTINUE SHOPPING */}

                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 text-sm font-medium mt-3 hover:underline"
                            >

                                <ArrowLeft size={17} />

                                Continue Shopping

                            </Link>

                        </div>


                        {/* =====================================
                            ORDER SUMMARY
                        ===================================== */}

                        <div>

                            <div className="bg-white border rounded-xl p-6 sticky top-24">

                                <h2 className="text-xl font-semibold mb-6">
                                    Order Summary
                                </h2>


                                <div className="space-y-4">


                                    {/* SUBTOTAL */}

                                    <div className="flex justify-between text-gray-600">

                                        <span>
                                            Subtotal
                                        </span>

                                        <span>
                                            ₹{subtotal.toFixed(2)}
                                        </span>

                                    </div>


                                    {/* SHIPPING */}

                                    <div className="flex justify-between text-gray-600">

                                        <span>
                                            Shipping
                                        </span>

                                        <span>

                                            {shipping === 0
                                                ? "FREE"
                                                : `₹${shipping.toFixed(2)}`
                                            }

                                        </span>

                                    </div>


                                    {/* GST */}

                                    <div className="flex justify-between text-gray-600">

                                        <span>
                                            GST (18%)
                                        </span>

                                        <span>
                                            ₹{gst.toFixed(2)}
                                        </span>

                                    </div>


                                    {/* PROMO */}

                                    {promoDiscount > 0 && (

                                        <div className="flex justify-between text-green-600">

                                            <span>
                                                Promo Discount
                                            </span>

                                            <span>
                                                -₹{promoDiscount.toFixed(2)}
                                            </span>

                                        </div>

                                    )}


                                    {/* TOTAL */}

                                    <div className="border-t pt-4">

                                        <div className="flex justify-between">

                                            <span className="text-lg font-semibold">
                                                Total
                                            </span>

                                            <span className="text-xl font-bold">
                                                ₹
                                                {Math.max(
                                                    total,
                                                    0
                                                ).toFixed(2)}
                                            </span>

                                        </div>

                                    </div>


                                    {/* =====================================
                                        PROMO CODE
                                    ===================================== */}

                                    <div className="border-t pt-5">

                                        <div className="flex items-center gap-2 mb-3">

                                            <Tag size={18} />

                                            <h3 className="font-semibold">
                                                Promo Code
                                            </h3>

                                        </div>


                                        <div className="flex gap-2">

                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) =>
                                                    setPromoCode(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter promo code"
                                                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                                            />


                                            <button
                                                type="button"
                                                onClick={
                                                    applyPromoCode
                                                }
                                                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                                            >
                                                Apply
                                            </button>

                                        </div>


                                        {promoMessage && (

                                            <p
                                                className={`text-xs mt-2 ${
                                                    promoDiscount > 0
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            >

                                                {promoMessage}

                                            </p>

                                        )}

                                    </div>


                                    {/* =====================================
                                        PLACE ORDER
                                    ===================================== */}

                                    <button
                                        onClick={() =>
                                            navigate("/adress", {
                                                state: {
                                                    subtotal,
                                                    gst,
                                                    shipping,
                                                    promoDiscount,
                                                    total: Math.max(
                                                        total,
                                                        0
                                                    ),
                                                },
                                            })
                                        }
                                        type="button"
                                        className="w-full bg-black text-white py-3 rounded-lg mt-5 hover:bg-gray-800 transition"
                                    >

                                        Place Order

                                    </button>


                                    {/* =====================================
                                        BENEFITS
                                    ===================================== */}

                                    <div className="border-t mt-6 pt-5 space-y-4">


                                        {/* FREE SHIPPING */}

                                        <div className="flex items-start gap-3">

                                            <Truck
                                                size={19}
                                                className="text-gray-700 mt-0.5"
                                            />

                                            <div>

                                                <p className="text-sm font-medium">
                                                    Free shipping on orders above ₹299
                                                </p>

                                            </div>

                                        </div>


                                        {/* RETURN */}

                                        <div className="flex items-start gap-3">

                                            <RotateCcw
                                                size={19}
                                                className="text-gray-700 mt-0.5"
                                            />

                                            <div>

                                                <p className="text-sm font-medium">
                                                    10 days return policy
                                                </p>

                                            </div>

                                        </div>


                                        {/* SSL */}

                                        <div className="flex items-start gap-3">

                                            <ShieldCheck
                                                size={19}
                                                className="text-gray-700 mt-0.5"
                                            />

                                            <div>

                                                <p className="text-sm font-medium">
                                                    Secure checkout with SSL encryption
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};


export default Cart;
