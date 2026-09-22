
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    ShoppingCart,
    Heart,
    Plus,
    Minus,
    Star,
    ArrowLeft,
    Truck,
    ShieldCheck,
    RotateCcw
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/CartSlice";

import { toast } from "sonner";
import axios from "axios";
import { serverURL } from "@/App";


const SingleProduct = () => {

    const { productId } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();


    // =========================================
    // REDUX
    // =========================================

    const { loading: cartLoading } = useSelector(
        (state) => state.cart
    );


    // =========================================
    // STATE
    // =========================================

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [selectedImage, setSelectedImage] = useState(0);

    const [wishlist, setWishlist] = useState(false);


    // =========================================
    // GET SINGLE PRODUCT
    // =========================================

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);

                setError("");

                const res = await axios.get(
                    `${serverURL}/api/product/get/${productId}`
                );

                console.log("PRODUCT API:", res.data);

                if (res.data.success) {

                    setProduct(res.data.product);

                } else {

                    setError(
                        res.data.message ||
                        "Product not found"
                    );

                }

            } catch (error) {

                console.log(
                    "PRODUCT ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to fetch product"
                );

            } finally {

                setLoading(false);

            }

        };


        if (productId) {

            fetchProduct();

        }

    }, [productId]);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="min-h-screen pt-28 flex items-center justify-center">

                <p className="text-gray-500 text-lg">
                    Loading product...
                </p>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error || !product) {

        return (

            <div className="min-h-screen pt-28 flex flex-col items-center justify-center px-4">

                <h2 className="text-2xl font-semibold">
                    Unable to fetch product
                </h2>

                <p className="text-red-500 mt-2">
                    {error || "Product not found"}
                </p>

                <Link
                    to="/products"
                    className="mt-6 inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg"
                >

                    <ArrowLeft size={18} />

                    Back to Products

                </Link>

            </div>

        );

    }


    // =========================================
    // DYNAMIC PRODUCT DATA
    // =========================================

    const images = Array.isArray(product.productImg)
        ? product.productImg
        : [];


    const productImage =
        images[selectedImage]?.Url ||
        images[0]?.Url ||
        "https://via.placeholder.com/600x600?text=Product";


    const price = Number(
        product.productprice || 0
    );


    /*
        If your schema has stock, it will use it.

        If stock does not exist in your schema,
        we consider the product available.
    */

    const hasStockField =
        product.stock !== undefined &&
        product.stock !== null;


    const stock = hasStockField
        ? Number(product.stock)
        : null;


    const outOfStock =
        hasStockField && stock <= 0;


    // =========================================
    // DYNAMIC RATING
    // =========================================

    const rating = Number(
        product.rating ||
        product.averageRating ||
        0
    );


    const reviewCount = Number(
        product.reviewCount ||
        product.reviews?.length ||
        0
    );


    // =========================================
    // REVIEWS
    // =========================================

    const reviews = Array.isArray(product.reviews)
        ? product.reviews
        : [];


    // =========================================
    // QUANTITY
    // =========================================

    const increaseQuantity = () => {

        if (
            hasStockField &&
            quantity >= stock
        ) {

            toast.error(
                "Maximum available stock reached"
            );

            return;

        }

        setQuantity(
            (previous) => previous + 1
        );

    };


    const decreaseQuantity = () => {

        if (quantity <= 1) {
            return;
        }

        setQuantity(
            (previous) => previous - 1
        );

    };


    // =========================================
    // ADD TO CART
    // =========================================

    const handleAddToCart = async () => {

        if (outOfStock) {

            toast.error("Product is out of stock");

            return;

        }


        try {

            await dispatch(
                addToCart({
                    productId: product._id,
                    quantity: quantity
                })
            ).unwrap();


            toast.success(
                `${product.productname} added to cart`
            );

        } catch (error) {

            toast.error(
                error || "Unable to add product"
            );

        }

    };


    // =========================================
    // BUY NOW
    // =========================================

    const handleBuyNow = async () => {

        if (outOfStock) {

            toast.error(
                "Product is out of stock"
            );

            return;

        }


        try {

            await dispatch(
                addToCart({
                    productId: product._id,
                    quantity: quantity
                })
            ).unwrap();


            navigate("/checkout");

        } catch (error) {

            toast.error(
                error || "Unable to proceed"
            );

        }

    };


    // =========================================
    // WISHLIST
    // =========================================

    const handleWishlist = () => {

        setWishlist(
            (previous) => !previous
        );


        if (!wishlist) {

            toast.success(
                "Added to wishlist"
            );

        } else {

            toast.success(
                "Removed from wishlist"
            );

        }

    };


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="min-h-screen bg-gray-50 pt-24 pb-14">

            <div className="max-w-7xl mx-auto px-4">


                {/* ================================= */}
                {/* BACK */}
                {/* ================================= */}

                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
                >

                    <ArrowLeft size={17} />

                    Back to Products

                </Link>


                {/* ================================= */}
                {/* PRODUCT CONTAINER */}
                {/* ================================= */}

                <div className="bg-white border rounded-2xl p-5 md:p-8">


                    <div className="grid lg:grid-cols-2 gap-10">


                        {/* ================================= */}
                        {/* PRODUCT IMAGES */}
                        {/* ================================= */}

                        <div>


                            {/* MAIN IMAGE */}

                            <div className="relative h-[450px] bg-gray-100 rounded-xl overflow-hidden">

                                <img
                                    src={productImage}
                                    alt={product.productname}
                                    className="w-full h-full object-contain"
                                />


                                {/* WISHLIST */}

                                <button
                                    type="button"
                                    onClick={handleWishlist}
                                    className="absolute top-4 right-4 bg-white p-3 rounded-full shadow hover:bg-gray-100"
                                >

                                    <Heart
                                        size={22}
                                        className={
                                            wishlist
                                                ? "fill-red-500 text-red-500"
                                                : "text-gray-700"
                                        }
                                    />

                                </button>

                            </div>


                            {/* IMAGE THUMBNAILS */}

                            {images.length > 0 && (

                                <div className="flex gap-3 mt-4 overflow-x-auto">

                                    {images.map(
                                        (image, index) => (

                                            <button
                                                key={
                                                    image.public_id ||
                                                    index
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setSelectedImage(index)
                                                }
                                                className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                                                    selectedImage === index
                                                        ? "border-black"
                                                        : "border-gray-200"
                                                }`}
                                            >

                                                <img
                                                    src={image.Url}
                                                    alt={
                                                        `${product.productname} ${index + 1}`
                                                    }
                                                    className="w-full h-full object-cover"
                                                />

                                            </button>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* ================================= */}
                        {/* PRODUCT INFORMATION */}
                        {/* ================================= */}

                        <div>


                            {/* BRAND */}

                            {product.brand && (

                                <p className="text-sm text-gray-500 uppercase tracking-wide">

                                    {product.brand}

                                </p>

                            )}


                            {/* PRODUCT NAME */}

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">

                                {product.productname}

                            </h1>


                            {/* RATING */}

                            <div className="flex items-center gap-3 mt-4">

                                <div className="flex">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <Star
                                                key={star}
                                                size={18}
                                                className={
                                                    star <= Math.round(rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            />

                                        )
                                    )}

                                </div>


                                <span className="text-sm text-gray-500">

                                    {rating > 0
                                        ? `${rating.toFixed(1)}`
                                        : "No rating"
                                    }

                                    {" "}

                                    ({reviewCount} reviews)

                                </span>

                            </div>


                            {/* PRICE */}

                            <div className="mt-6">

                                <p className="text-3xl font-bold text-gray-900">

                                    ₹{price.toFixed(2)}

                                </p>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="mt-6">

                                <h2 className="text-lg font-semibold">

                                    Product Details

                                </h2>

                                <p className="text-gray-600 mt-2 leading-7">

                                    {product.productdesc ||
                                        "No description available for this product."
                                    }

                                </p>

                            </div>


                            {/* CATEGORY + BRAND */}

                            <div className="flex flex-wrap gap-3 mt-5">

                                {product.category && (

                                    <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                                        Category: {product.category}

                                    </span>

                                )}


                                {product.brand && (

                                    <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                                        Brand: {product.brand}

                                    </span>

                                )}

                            </div>


                            {/* STOCK */}

                            <div className="mt-6">

                                {outOfStock ? (

                                    <p className="font-semibold text-red-600">

                                        Out of Stock

                                    </p>

                                ) : hasStockField ? (

                                    <p className="font-semibold text-green-600">

                                        In Stock

                                        {" "}

                                        ({stock} available)

                                    </p>

                                ) : (

                                    <p className="font-semibold text-green-600">

                                        In Stock

                                    </p>

                                )}

                            </div>


                            {/* ================================= */}
                            {/* QUANTITY */}
                            {/* ================================= */}

                            {!outOfStock && (

                                <div className="mt-6">

                                    <p className="font-medium mb-2">

                                        Quantity

                                    </p>


                                    <div className="flex items-center border rounded-lg w-fit">

                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            disabled={
                                                quantity <= 1
                                            }
                                            className="p-3 hover:bg-gray-100 disabled:opacity-40"
                                        >

                                            <Minus size={18} />

                                        </button>


                                        <span className="px-5 font-semibold">

                                            {quantity}

                                        </span>


                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            disabled={
                                                hasStockField &&
                                                quantity >= stock
                                            }
                                            className="p-3 hover:bg-gray-100 disabled:opacity-40"
                                        >

                                            <Plus size={18} />

                                        </button>

                                    </div>

                                </div>

                            )}


                            {/* ================================= */}
                            {/* CART + BUY */}
                            {/* ================================= */}

                            <div className="flex flex-col sm:flex-row gap-3 mt-7">

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={
                                        outOfStock ||
                                        cartLoading
                                    }
                                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                                >

                                    <ShoppingCart size={19} />

                                    {cartLoading
                                        ? "Adding..."
                                        : "Add to Cart"
                                    }

                                </button>


                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={
                                        outOfStock ||
                                        cartLoading
                                    }
                                    className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 disabled:bg-gray-400"
                                >

                                    Buy Now

                                </button>

                            </div>


                            {/* ================================= */}
                            {/* BENEFITS */}
                            {/* ================================= */}

                            <div className="border-t mt-8 pt-6 space-y-5">


                                <div className="flex gap-3">

                                    <Truck
                                        size={21}
                                        className="text-gray-700"
                                    />

                                    <div>

                                        <p className="font-medium">
                                            Free Shipping
                                        </p>

                                        <p className="text-sm text-gray-500">

                                            On orders above ₹299

                                        </p>

                                    </div>

                                </div>


                                <div className="flex gap-3">

                                    <RotateCcw
                                        size={21}
                                        className="text-gray-700"
                                    />

                                    <div>

                                        <p className="font-medium">
                                            10 Days Return
                                        </p>

                                        <p className="text-sm text-gray-500">

                                            Easy return within 10 days

                                        </p>

                                    </div>

                                </div>


                                <div className="flex gap-3">

                                    <ShieldCheck
                                        size={21}
                                        className="text-gray-700"
                                    />

                                    <div>

                                        <p className="font-medium">
                                            Secure Checkout
                                        </p>

                                        <p className="text-sm text-gray-500">

                                            Protected with SSL encryption

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* REVIEWS */}
                    {/* ================================= */}

                    <div className="border-t mt-10 pt-8">

                        <h2 className="text-2xl font-bold">

                            Reviews & Ratings

                        </h2>


                        {/* DYNAMIC REVIEW SUMMARY */}

                        <div className="mt-5 flex items-center gap-4">

                            <div className="text-4xl font-bold">

                                {rating > 0
                                    ? rating.toFixed(1)
                                    : "—"
                                }

                            </div>


                            <div>

                                <div className="flex">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <Star
                                                key={star}
                                                size={18}
                                                className={
                                                    star <= Math.round(rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            />

                                        )
                                    )}

                                </div>


                                <p className="text-sm text-gray-500 mt-1">

                                    {reviewCount} reviews

                                </p>

                            </div>

                        </div>


                        {/* DYNAMIC REVIEWS */}

                        {reviews.length > 0 ? (

                            <div className="mt-6 space-y-4">

                                {reviews.map(
                                    (review, index) => (

                                        <div
                                            key={
                                                review._id ||
                                                index
                                            }
                                            className="border rounded-lg p-5"
                                        >

                                            <div className="flex justify-between gap-4">

                                                <div>

                                                    <p className="font-semibold">

                                                        {review.user?.firstName ||
                                                            review.name ||
                                                            "Customer"
                                                        }

                                                    </p>

                                                    <div className="flex mt-1">

                                                        {[
                                                            1,
                                                            2,
                                                            3,
                                                            4,
                                                            5
                                                        ].map(
                                                            (star) => (

                                                                <Star
                                                                    key={star}
                                                                    size={15}
                                                                    className={
                                                                        star <=
                                                                        Number(
                                                                            review.rating || 0
                                                                        )
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }
                                                                />

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            </div>


                                            <p className="text-gray-600 mt-3">

                                                {review.comment ||
                                                    "No comment."
                                                }

                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="mt-6 border rounded-lg p-6 text-center">

                                <p className="text-gray-500">

                                    No reviews yet.

                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

};


export default SingleProduct;
