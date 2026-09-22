import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { Skeleton } from "./ui/skeleton";
import { addToCart } from "@/redux/CartSlice";

const ProductCard = ({ product, loading }) => {
  const dispatch = useDispatch();

  const { loading: cartLoading } = useSelector((state) => state.cart);

  const productImage = product?.productImg?.[0]?.Url;

  const handleAddToCart = async () => {
    if (!product?._id) {
      toast.error("Product not found");
      return;
    }

    try {
      const result = await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
        })
      );

      if (addToCart.fulfilled.match(result)) {
        toast.success(`${product.productname} added to cart`);
      } else {
        toast.error(result.payload || "Unable to add product to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Skeleton className="h-44 w-full sm:h-48" />

        <div className="space-y-3 p-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-4 h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/product/${product?._id}`} className="block">
        <div className="relative h-44 overflow-hidden bg-gray-100 sm:h-48">
          <img
            src={
              productImage ||
              "https://via.placeholder.com/400x400?text=Product"
            }
            alt={product?.productname || "Product"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

          {product?.category && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
              {product.category}
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="mb-1 truncate text-sm text-gray-500">
            {product?.brand || "CartVerse"}
          </p>

          <h2 className="truncate text-lg font-semibold text-gray-900">
            {product?.productname || "Product name"}
          </h2>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
            {product?.productdesc || "No description available."}
          </p>

          <div className="mt-3 flex items-center gap-1">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <p className="text-lg font-bold text-gray-900">
          ₹{product?.productprice || 0}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={cartLoading}
          className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <ShoppingCart size={16} />
          {cartLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;