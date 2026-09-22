import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { setUser } from "@/redux/userSlice";
import { clearCartState, getCart } from "@/redux/CartSlice";
import { serverURL } from "../App";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { cart = [] } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  const profileImage =
    user?.profilePicture || user?.avatar || user?.image || "";

  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + Number(item.quantity || 0), 0)
    : 0;

  useEffect(() => {
    if (user && accessToken) {
      dispatch(getCart());
    }
  }, [user, accessToken, dispatch]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const clearUserSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    dispatch(setUser(null));
    dispatch(clearCartState());

    closeMenu();
    navigate("/login");
  };

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${serverURL}/api/user/logout`,
        {},
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);

      if (error.response?.status !== 401) {
        toast.error("You were logged out from this device.");
      }
    } finally {
      clearUserSession();
    }
  };

  return (
    <header className="fixed top-0 z-30 w-full border-b border-pink-200 bg-pink-100">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 py-3">

        {/* CartVerse Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-md">
            <ShoppingCart
              size={23}
              strokeWidth={2.5}
              className="text-white"
            />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Cart<span className="text-pink-600">Verse</span>
          </span>
        </Link>

        {/* Mobile profile and hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <Link
              to={`/profile/${user._id}`}
              onClick={closeMenu}
              className="flex max-w-35 items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:bg-pink-50"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user.firstName || "User"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-semibold text-white">
                  {user.firstName?.charAt(0).toUpperCase() || "U"}
                </span>
              )}

              <span className="truncate text-sm font-medium text-gray-800">
                Hello, {user.firstName}
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-gray-800 transition hover:bg-pink-200"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop and mobile menu */}
        <nav
          className={`absolute left-0 top-full w-full border-b border-pink-200 bg-pink-100 px-4 py-4 md:static md:flex md:w-auto md:items-center md:border-0 md:p-0 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">

            <Link
              to="/"
              onClick={closeMenu}
              className="font-bold text-gray-800 hover:text-pink-600"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={closeMenu}
              className="font-bold text-gray-800 hover:text-pink-600"
            >
              Products
            </Link>

            {/* Desktop profile link */}
            {user && (
              <Link
                to={`/profile/${user._id}`}
                onClick={closeMenu}
                className="hidden font-bold text-gray-800 hover:text-pink-600 md:block"
              >
                Hello, {user.firstName}
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/dashboard/sales"
                onClick={closeMenu}
                className="font-bold text-purple-700 hover:text-purple-900"
              >
                Dashboard
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative flex w-fit items-center gap-2 font-medium text-gray-800 hover:text-pink-600"
            >
              {/* Cart Icon + Badge */}
              <span className="relative flex items-center">
                <ShoppingCart size={23} />

                <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                  {cartCount}
                </span>
              </span>

              
            </Link>

            {user ? (
              <Button
                onClick={logoutHandler}
                className="bg-pink-600 text-white hover:bg-pink-700"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  closeMenu();
                  navigate("/login");
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-102 transition cursor-grab"
              >
                Login
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;