import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  IndianRupee,
  Loader2,
  Package,
  RefreshCw,
  Truck,
  User,
} from "lucide-react";
import { serverURL } from "@/App";

const formatPrice = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  const styles = {
    pending: "bg-gray-100 text-gray-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    paid: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return styles[status?.toLowerCase()] || styles.pending;
};

const InfoCard = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
};

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  const getConfig = () => {
    const token = localStorage.getItem("accessToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const getAllOrders = async () => {
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login again");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${serverURL}/api/order/all-orders`,
        getConfig()
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Get orders error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setStatusLoading(orderId);

      await axios.put(
        `${serverURL}/api/order/update-status/${orderId}`,
        { status },
        {
          ...getConfig(),
          headers: {
            ...getConfig().headers,
            "Content-Type": "application/json",
          },
        }
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );

      toast.success("Order status updated");
    } catch (error) {
      console.error("Update status error:", error);

      toast.error(
        error.response?.data?.message || "Unable to update order status"
      );
    } finally {
      setStatusLoading(null);
    }
  };

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.amount || 0),
    0
  );

  const paidOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "paid"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pt-20">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-pink-500" />
          <p className="mt-3 text-sm text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-12 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              All Orders
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer orders and delivery status
            </p>
          </div>

          <button
            type="button"
            onClick={getAllOrders}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Package size={20} className="text-blue-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CreditCard size={20} className="text-green-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Paid Orders</p>
              <p className="text-xl font-bold text-gray-900">{paidOrders}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <IndianRupee size={20} className="text-purple-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">
                ₹{formatPrice(totalRevenue)}
              </p>
            </div>
          </div>
        </section>

        {!orders.length ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <Package size={44} className="mx-auto text-gray-300" />
            <h2 className="mt-4 font-semibold text-gray-700">
              No orders found
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const customer = order.userId;

              const customerName =
                `${customer?.firstName || customer?.firstname || ""} ${
                  customer?.lastName || customer?.lastname || ""
                }`.trim() || "Customer";

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="p-4 sm:p-5">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)_auto_auto_auto] lg:items-center">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Package size={20} className="text-gray-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            Order #
                            {order.razorpayOrderId || order._id?.slice(-8)}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={13} />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                          <User size={18} className="text-blue-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {customerName}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {customer?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-bold text-gray-900">
                          ₹{formatPrice(order.amount)}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "pending"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order._id)
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        {isExpanded ? "Hide details" : "View details"}
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-5">
                      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Truck size={18} className="text-gray-700" />
                          <h3 className="text-sm font-semibold text-gray-800">
                            Update Shipping Status
                          </h3>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <select
                            value={order.status || "pending"}
                            onChange={(event) =>
                              updateOrderStatus(order._id, event.target.value)
                            }
                            disabled={statusLoading === order._id}
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-pink-400"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {statusLoading === order._id && (
                            <div className="flex items-center justify-center gap-2 px-3 text-sm text-gray-500">
                              <Loader2 size={17} className="animate-spin" />
                              Updating...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-5">
                        <h3 className="mb-3 font-semibold text-gray-800">
                          Products
                        </h3>

                        <div className="space-y-2">
                          {order.products?.map((item, index) => {
                            const product = item.productId;

                            return (
                              <div
                                key={product?._id || index}
                                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-800">
                                    {product?.productname ||
                                      product?.name ||
                                      "Product"}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Quantity: {item.quantity || 1}
                                  </p>
                                </div>

                                <p className="shrink-0 text-sm font-semibold text-gray-900">
                                  ₹
                                  {formatPrice(
                                    product?.productprice || product?.price
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoCard
                          label="Tax / GST"
                          value={`₹${formatPrice(order.tax)}`}
                        />
                        <InfoCard
                          label="Shipping"
                          value={`₹${formatPrice(order.shipping)}`}
                        />
                        <InfoCard
                          label="Currency"
                          value={order.currency || "INR"}
                        />
                        <InfoCard
                          label="Status"
                          value={order.status || "pending"}
                        />
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <CreditCard size={17} className="text-gray-600" />
                            <h3 className="text-sm font-semibold">
                              Payment Information
                            </h3>
                          </div>

                          <div className="grid gap-3 text-xs sm:grid-cols-2">
                            <div>
                              <p className="text-gray-500">
                                Razorpay Order ID
                              </p>
                              <p className="mt-1 break-all font-medium">
                                {order.razorpayOrderId || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-gray-500">
                                Razorpay Payment ID
                              </p>
                              <p className="mt-1 break-all font-medium">
                                {order.razorpayPaymentId || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <User size={17} className="text-gray-600" />
                            <h3 className="text-sm font-semibold">
                              Customer Information
                            </h3>
                          </div>

                          <div className="grid gap-3 text-xs sm:grid-cols-2">
                            <div>
                              <p className="text-gray-500">Name</p>
                              <p className="mt-1 font-medium">{customerName}</p>
                            </div>

                            <div>
                              <p className="text-gray-500">Email</p>
                              <p className="mt-1 break-all font-medium">
                                {customer?.email || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-gray-500">Phone</p>
                              <p className="mt-1 font-medium">
                                {customer?.phoneNo || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-gray-500">Address</p>
                              <p className="mt-1 font-medium">
                                {customer?.address || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminOrder;