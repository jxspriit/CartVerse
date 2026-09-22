import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  IndianRupee,
  Loader2,
  Package,
  RefreshCw,
  Truck,
  User,
  Users,
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
  const classes = {
    delivered: "bg-green-50 text-green-600",
    paid: "bg-green-50 text-green-600",
    shipped: "bg-blue-50 text-blue-600",
    processing: "bg-yellow-50 text-yellow-700",
    cancelled: "bg-red-50 text-red-600",
  };

  return classes[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
};

const StatCard = ({ title, value, icon: Icon, iconClass, link, linkText }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={22} />
        </div>
      </div>

      {link ? (
        <Link
          to={link}
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-pink-600 hover:underline"
        >
          {linkText}
          <ArrowRight size={13} />
        </Link>
      ) : (
        <p className="mt-4 text-xs text-gray-400">From all orders</p>
      )}
    </div>
  );
};

const StatusCard = ({ title, value, icon: Icon, iconClass }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login again");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [usersResponse, ordersResponse] = await Promise.all([
        axios.get(`${serverURL}/api/user/all-user`, config),
        axios.get(`${serverURL}/api/order/all-orders`, config),
      ]);

      setUsers(usersResponse.data.users || []);
      setOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.error("Dashboard error:", error);

      if (!error.response) {
        toast.error("Cannot connect to the backend server.");
      } else {
        toast.error(
          error.response.data?.message || "Unable to load dashboard"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const getOrderCount = (status) => {
    return orders.filter(
      (order) => order.status?.toLowerCase() === status
    ).length;
  };

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.amount || 0),
    0
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusCards = [
    {
      title: "Pending",
      value: getOrderCount("pending"),
      icon: Clock,
      iconClass: "bg-gray-100 text-gray-500",
    },
    {
      title: "Processing",
      value: getOrderCount("processing"),
      icon: Package,
      iconClass: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Shipped",
      value: getOrderCount("shipped"),
      icon: Truck,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Delivered",
      value: getOrderCount("delivered"),
      icon: CheckCircle,
      iconClass: "bg-green-50 text-green-600",
    },
  ];

  if (loading && !users.length && !orders.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={34} className="mx-auto animate-spin text-pink-500" />
          <p className="mt-3 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your CartVerse store
            </p>
          </div>

          <button
            type="button"
            onClick={getDashboardData}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Refresh
          </button>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={users.length}
            icon={Users}
            iconClass="bg-pink-50 text-pink-500"
            link="/dashboard/user"
            linkText="View users"
          />

          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={Package}
            iconClass="bg-blue-50 text-blue-500"
            link="/dashboard/orders"
            linkText="View orders"
          />

          <StatCard
            title="Total Revenue"
            value={`₹${formatPrice(totalRevenue)}`}
            icon={IndianRupee}
            iconClass="bg-purple-50 text-purple-500"
          />

          <StatCard
            title="Paid Orders"
            value={getOrderCount("paid")}
            icon={CreditCard}
            iconClass="bg-green-50 text-green-500"
          />
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {statusCards.map((card) => (
            <StatusCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
              <div>
                <h2 className="font-semibold text-gray-800">Recent Orders</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Latest customer orders
                </p>
              </div>

              <Link
                to="/dashboard/orders"
                className="text-xs font-medium text-pink-600 hover:underline"
              >
                View all
              </Link>
            </div>

            {!recentOrders.length ? (
              <div className="p-10 text-center">
                <Package size={35} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => {
                  const customer = order.userId;
                  const customerName =
                    `${customer?.firstName || customer?.firstname || ""} ${
                      customer?.lastName || customer?.lastname || ""
                    }`.trim() || "Customer";

                  return (
                    <div
                      key={order._id}
                      className="p-4 transition hover:bg-gray-50 sm:px-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <Package size={18} className="text-gray-500" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-800">
                              #{order.razorpayOrderId || order._id?.slice(-8)}
                            </p>
                            <p className="mt-1 truncate text-xs text-gray-400">
                              {customerName}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{formatPrice(order.amount)}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-medium capitalize ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status || "pending"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between text-xs text-gray-400">
                        <span>{formatDate(order.createdAt)}</span>
                        <span>{order.products?.length || 0} item(s)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
              <div>
                <h2 className="font-semibold text-gray-800">Recent Users</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Newly registered users
                </p>
              </div>

              <Link
                to="/dashboard/user"
                className="text-xs font-medium text-pink-600 hover:underline"
              >
                View all
              </Link>
            </div>

            {!recentUsers.length ? (
              <div className="p-10 text-center">
                <Users size={35} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No users yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentUsers.map((user) => {
                  const fullName =
                    `${user.firstName || user.firstname || ""} ${
                      user.lastName || user.lastname || ""
                    }`.trim() || "User";

                  const image =
                    user.profilePic || user.profilePicture || user.avatar;

                  return (
                    <div key={user._id} className="flex items-center gap-3 p-4 sm:px-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-pink-50">
                        {image ? (
                          <img
                            src={image}
                            alt={fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={18} className="text-pink-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {fullName}
                        </p>
                        <p className="mt-1 truncate text-xs text-gray-400">
                          {user.email}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-pink-50 text-pink-600"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;