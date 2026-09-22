import React, { useEffect, useState } from "react";
import {
  Camera,
  Package,
  User,
  X,
  ShoppingBag,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import axios from "axios";
import { serverURL } from "@/App";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const params = useParams();
  const userId = params.userId;

  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  // =====================================
  // PROFILE STATE
  // =====================================

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // =====================================
  // ORDERS STATE
  // =====================================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Selected order for View Order
  const [selectedOrder, setSelectedOrder] = useState(null);

  // =====================================
  // UPDATE PROFILE WHEN USER CHANGES
  // =====================================

  useEffect(() => {
    if (!user) return;

    setProfile({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNo: user.phoneNo || "",
      address: user.address || "",
      city: user.city || "",
      zipCode: user.zipCode || "",
      profilePic: user.profilePic || "",
      role: user.role || "",
    });
  }, [user]);

  // =====================================
  // GET ORDERS
  // =====================================

  const getMyOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login to view your orders");
      return;
    }

    setOrdersLoading(true);

    try {
      const res = await axios.get(
        `${serverURL}/api/order/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.log(
        "GET ORDERS ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  // =====================================
  // LOAD ORDERS WHEN ORDERS TAB OPENS
  // =====================================

  useEffect(() => {
    if (activeTab === "orders") {
      getMyOrders();
    }
  }, [activeTab]);

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setProfilePic(selectedFile);

      setProfile((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(selectedFile),
      }));
    }
  };

  // =====================================
  // UPDATE PROFILE
  // =====================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login again");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phoneNo", profile.phoneNo);
      formData.append("address", profile.address);
      formData.append("city", profile.city);
      formData.append("zipCode", profile.zipCode);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await axios.put(
        `${serverURL}/api/user/update-user/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed To Update Profile!"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // ORDER DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // ORDER STATUS STYLE
  // =====================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================
  // OPEN ORDER
  // =====================================

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  // =====================================
  // CLOSE ORDER
  // =====================================

  const closeOrder = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 pt-18">
      <div className="max-w-2xl mx-auto">

        {/* PAGE HEADING */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            My Account
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your profile and orders
          </p>
        </div>

        {/* MAIN CARD */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* TABS */}

          <div className="flex border-b border-gray-200">

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <User size={25} />
              Profile
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === "orders"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Package size={25} />
              Orders
            </button>

          </div>

          {/* =====================================
              PROFILE TAB
          ===================================== */}

          {activeTab === "profile" && (
            <form
              onSubmit={handleUpdate}
              className="p-4 md:p-3"
            >

              {/* PROFILE IMAGE */}

              <div className="flex items-center gap-5 mb-5">

                <div className="relative">

                  <img
                    src={
                      profile.profilePic ||
                      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-black"
                  />

                  <label
                    htmlFor="profilePic"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                  >
                    <Camera size={14} />
                  </label>

                  <input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    Profile Picture
                  </h2>

                  <label
                    htmlFor="profilePic"
                    className="text-sm text-blue-700 cursor-pointer hover:underline"
                  >
                    Change Pic
                  </label>

                </div>

              </div>

              {/* FORM FIELDS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    placeholder="Enter Your First Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    placeholder="Enter Your Last Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    disabled
                    value={profile.email}
                    className="w-full text-gray-500 border bg-gray-50 border-gray-300 rounded-lg px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phoneNo"
                    value={profile.phoneNo}
                    onChange={handleChange}
                    placeholder="Enter your number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Enter Your Full Address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    placeholder="Enter Your City"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zipcode
                  </label>

                  <input
                    type="text"
                    name="zipCode"
                    value={profile.zipCode}
                    onChange={handleChange}
                    placeholder="Enter Your Zip Code"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* UPDATE BUTTON */}

              <div className="mt-8 flex justify-end">

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Please Wait..."
                    : "Update Profile"}
                </button>

              </div>

            </form>
          )}

          {/* =====================================
              ORDERS TAB
          ===================================== */}

          {activeTab === "orders" && (
            <div className="p-6 md:p-8">

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Orders
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  View your recent orders and their status
                </p>
              </div>

              {/* LOADING */}

              {ordersLoading && (
                <div className="text-center py-10">

                  <div className="w-7 h-7 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />

                  <p className="text-sm text-gray-500 mt-3">
                    Loading orders...
                  </p>

                </div>
              )}

              {/* EMPTY */}

              {!ordersLoading &&
                orders.length === 0 && (
                  <div className="text-center py-10">

                    <Package
                      size={40}
                      className="mx-auto text-gray-300"
                    />

                    <p className="font-medium text-gray-700 mt-3">
                      No orders found
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Your orders will appear here.
                    </p>

                  </div>
                )}

              {/* ORDERS */}

              {!ordersLoading &&
                orders.length > 0 && (
                  <div className="space-y-4">

                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition"
                      >

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                          {/* ORDER INFO */}

                          <div>
                            <p className="font-semibold text-gray-900">
                              #
                              {order.razorpayOrderId ||
                                order._id}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          {/* TOTAL */}

                          <div className="text-sm">
                            <span className="text-gray-500">
                              Total
                            </span>

                            <p className="font-semibold text-gray-900">
                              {order.currency === "INR"
                                ? "₹"
                                : order.currency}

                              {Number(
                                order.amount || 0
                              ).toFixed(2)}
                            </p>
                          </div>

                          {/* STATUS */}

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status
                              ?.charAt(0)
                              .toUpperCase() +
                              order.status?.slice(1)}
                          </span>

                          {/* VIEW ORDER */}

                          <button
                            type="button"
                            onClick={() =>
                              handleViewOrder(order)
                            }
                            className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                          >
                            View Order
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

            </div>
          )}

        </div>
      </div>

      {/* =====================================
          ORDER DETAILS MODAL
      ===================================== */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={closeOrder}
        >

          <div
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-5 border-b">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Details
                </h2>

                <p className="text-sm text-gray-500">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                onClick={closeOrder}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* ORDER DETAILS */}

            <div className="p-5 space-y-5">

              {/* ORDER ID */}

              <div className="bg-gray-50 rounded-lg p-4">

                <p className="text-xs text-gray-500">
                  Order ID
                </p>

                <p className="font-semibold text-gray-900 break-all">
                  {selectedOrder.razorpayOrderId ||
                    selectedOrder._id}
                </p>

              </div>

              {/* STATUS */}

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Status
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status
                    ?.charAt(0)
                    .toUpperCase() +
                    selectedOrder.status?.slice(1)}
                </span>

              </div>

              {/* PRODUCTS */}

              <div>

                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag size={18} />

                  <h3 className="font-semibold">
                    Products
                  </h3>
                </div>

                <div className="space-y-3">

                  {selectedOrder.products?.map(
                    (item, index) => {

                      const product =
                        item.productId;

                      return (
                        <div
                          key={
                            product?._id ||
                            index
                          }
                          className="border rounded-lg p-3"
                        >

                          <div className="flex justify-between gap-3">

                            <div>

                              <p className="font-medium text-gray-900">
                                {product?.name ||
                                  "Product"}
                              </p>

                              <p className="text-sm text-gray-500">
                                Quantity:{" "}
                                {item.quantity}
                              </p>

                            </div>

                            {product?.productprice && (
                              <p className="font-medium">
                                ₹
                                {Number(
                                  product.productprice
                                ).toFixed(2)}
                              </p>
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* PRICE DETAILS */}

              <div className="border-t pt-4 space-y-2">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Amount
                  </span>

                  <span>
                    ₹
                    {Number(
                      selectedOrder.amount || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tax
                  </span>

                  <span>
                    ₹
                    {Number(
                      selectedOrder.tax || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span>
                    ₹
                    {Number(
                      selectedOrder.shipping || 0
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-base border-t pt-3">

                  <span>
                    Total
                  </span>

                  <span>
                    ₹
                    {(
                      Number(
                        selectedOrder.amount || 0
                      ) +
                      Number(
                        selectedOrder.tax || 0
                      ) +
                      Number(
                        selectedOrder.shipping || 0
                      )
                    ).toFixed(2)}
                  </span>

                </div>

              </div>

              {/* PAYMENT DETAILS */}

              {selectedOrder.razorpayPaymentId && (
                <div className="border-t pt-4">

                  <h3 className="font-semibold mb-3">
                    Payment Details
                  </h3>

                  <div className="space-y-2 text-sm">

                    <div>
                      <span className="text-gray-500">
                        Payment ID
                      </span>

                      <p className="break-all">
                        {selectedOrder.razorpayPaymentId}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Payment Status
                      </span>

                      <p className="text-green-600 font-medium">
                        Payment Verified
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* CLOSE BUTTON */}

            <div className="p-5 border-t">

              <button
                onClick={closeOrder}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Profile;
