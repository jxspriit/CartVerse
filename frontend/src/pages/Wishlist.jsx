import React, { useEffect } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {Link} from 'react-router-dom'

const Wishlist = () => {
    const dispatch = useDispatch();

    // Replace with your Redux slice
    const { wishlist = [], loading } = useSelector(
        (state) => state.wishlist
    );

    useEffect(() => {
        // dispatch(getWishlist());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="h-56 bg-gray-200"></div>

                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!wishlist.length) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
                <Heart className="w-20 h-20 text-red-500 fill-red-500" />

                <h2 className="text-3xl font-bold mt-6">
                    Your Wishlist is Empty
                </h2>

                <p className="text-gray-500 mt-2">
                    Save your favourite products here.
                </p>
                <Link to="/products">
                <button className="mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                    Continue Shopping
                </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">
                    My Wishlist ({wishlist.length})
                </h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {wishlist.map((item) => {
                    const product = item.productId;

                    return (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={product.productImg?.[0]?.Url}
                                    alt={product.productname}
                                    className="w-full h-64 object-cover"
                                />

                                <button
                                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50"
                                    // onClick={() => dispatch(removeFromWishlist(product._id))}
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            </div>

                            <div className="p-5">
                                <h2 className="font-bold text-lg line-clamp-1">
                                    {product.productname}
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    {product.brand}
                                </p>

                                <div className="flex items-center mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}

                                    <span className="text-gray-500 text-sm ml-2">
                                        (4.8)
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <span className="text-2xl font-bold text-green-600">
                                        ₹{product.productprice}
                                    </span>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        className="flex-1 flex justify-center items-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
                                        // onClick={() => dispatch(addToCart(product._id))}
                                    >
                                        <ShoppingCart size={18} />
                                        Move to Cart
                                    </button>

                                    <button
                                        className="border border-red-500 text-red-500 px-4 rounded-lg hover:bg-red-50"
                                        // onClick={() => dispatch(removeFromWishlist(product._id))}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wishlist;