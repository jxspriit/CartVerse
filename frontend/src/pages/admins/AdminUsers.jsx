import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Calendar,
  CircleCheck,
  CircleX,
  Edit,
  Loader2,
  Mail,
  Package,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  User,
  Users,
  X,
} from "lucide-react";
import { serverURL } from "@/App";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price) => {
  return Number(price || 0).toFixed(2);
};

const getStatusClass = (status) => {
  const styles = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-700";
};

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("user");
  const [updateLoading, setUpdateLoading] = useState(false);

  const [showOrders, setShowOrders] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const getConfig = () => {
    const token = localStorage.getItem("accessToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const getFullName = (user) => {
    return (
      `${user?.firstName || user?.firstname || ""} ${
        user?.lastName || user?.lastname || ""
      }`.trim() || "User"
    );
  };

  const getInitials = (user) => {
    const first = user?.firstName || user?.firstname || "";
    const last = user?.lastName || user?.lastname || "";

    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";
  };

  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${serverURL}/api/user/all-user`,
        getConfig()
      );

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Get users error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      getFullName(user).toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.phoneNo?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
    );
  });

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setRole(user.role || "user");
  };

  const closeRoleModal = () => {
    if (updateLoading) return;

    setSelectedUser(null);
    setRole("user");
  };

  const updateUserRole = async (event) => {
    event.preventDefault();

    if (!selectedUser) return;

    try {
      setUpdateLoading(true);

      await axios.put(
        `${serverURL}/api/user/update-user/${selectedUser._id}`,
        { role },
        {
          ...getConfig(),
          headers: {
            ...getConfig().headers,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role } : user
        )
      );

      toast.success("User role updated successfully");
      closeRoleModal();
    } catch (error) {
      console.error("Update user error:", error);

      toast.error(
        error.response?.data?.message || "Unable to update user role"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const viewOrders = async (user) => {
    try {
      setSelectedUser(user);
      setShowOrders(true);
      setOrdersLoading(true);
      setUserOrders([]);

      const response = await axios.get(
        `${serverURL}/api/order/all-orders`,
        getConfig()
      );

      const orders = response.data.orders || [];

      const selectedUserOrders = orders.filter((order) => {
        const orderUserId = order.userId?._id || order.userId;

        return orderUserId?.toString() === user._id?.toString();
      });

      setUserOrders(selectedUserOrders);
    } catch (error) {
      console.error("Get user orders error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load user orders"
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeOrdersModal = () => {
    setShowOrders(false);
    setUserOrders([]);
  };

  const UserAvatar = ({ user, size = "h-12 w-12" }) => {
    const image =
      user.profilePic || user.profilePicture || user.avatar || "";

    return (
      <div
        className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-pink-100 font-bold text-pink-600`}
      >
        {image ? (
          <img
            src={image}
            alt={getFullName(user)}
            className="h-full w-full object-cover"
          />
        ) : (
          getInitials(user)
        )}
      </div>
    );
  };

  const RoleBadge = ({ user }) => {
    const isAdmin = user.role === "admin";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          isAdmin
            ? "bg-purple-50 text-purple-600"
            : "bg-pink-50 text-pink-600"
        }`}
      >
        {isAdmin ? <ShieldCheck size={14} /> : <Shield size={14} />}
        {isAdmin ? "Admin" : "User"}
      </span>
    );
  };

  const UserActions = ({ user }) => {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openRoleModal(user)}
          className="flex items-center justify-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-100"
        >
          <Edit size={16} />
          <span className="md:hidden">Edit Role</span>
        </button>

        <button
          type="button"
          onClick={() => viewOrders(user)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
        >
          <Package size={16} />
          <span className="md:hidden">Orders</span>
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100">
              <Users size={23} className="text-pink-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">Users</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage users in your store
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Total users:{" "}
            <span className="font-semibold text-pink-600">
              {users.length}
            </span>
          </p>
        </header>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone or role..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-50"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-12">
            <Loader2 size={30} className="animate-spin text-pink-500" />
            <p className="mt-3 text-sm text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <Users size={40} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {search ? "No users found" : "No users available"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      User
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Contact
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Role
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />

                          <div className="min-w-0">
                            <p className="max-w-50 truncate font-semibold text-gray-800">
                              {getFullName(user)}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              ID: {user._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="flex max-w-50 items-center gap-2 truncate text-sm text-gray-600">
                            <Mail size={14} className="shrink-0 text-gray-400" />
                            {user.email || "No email"}
                          </p>

                          <p className="text-xs text-gray-400">
                            {user.phoneNo || "No phone number"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <RoleBadge user={user} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-2 text-xs">
                          <p
                            className={`flex items-center gap-1.5 ${
                              user.isVerified
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {user.isVerified ? (
                              <CircleCheck size={14} />
                            ) : (
                              <CircleX size={14} />
                            )}
                            {user.isVerified ? "Verified" : "Unverified"}
                          </p>

                          <p className="flex items-center gap-1.5 text-gray-500">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                user.isLoggedIn
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            {user.isLoggedIn ? "Online" : "Offline"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <UserActions user={user} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredUsers.map((user) => (
                <article key={user._id} className="p-4">
                  <div className="flex gap-3">
                    <UserAvatar user={user} size="h-16 w-16" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="truncate font-semibold text-gray-800">
                            {getFullName(user)}
                          </h2>
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {user.email || "No email"}
                          </p>
                        </div>

                        <RoleBadge user={user} />
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        {user.phoneNo || "No phone number"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4 text-xs">
                    <span
                      className={`flex items-center gap-1.5 ${
                        user.isVerified ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {user.isVerified ? (
                        <CircleCheck size={14} />
                      ) : (
                        <CircleX size={14} />
                      )}
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>

                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.isLoggedIn ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      {user.isLoggedIn ? "Online" : "Offline"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <UserActions user={user} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit role modal */}
      {selectedUser && !showOrders && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center sm:p-5">
          <button
            type="button"
            onClick={closeRoleModal}
            className="absolute inset-0 cursor-default"
            aria-label="Close modal"
          />

          <div className="relative w-full rounded-t-3xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit User Role
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Change access level for this user
                </p>
              </div>

              <button
                type="button"
                onClick={closeRoleModal}
                disabled={updateLoading}
                className="rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <UserAvatar user={selectedUser} size="h-11 w-11" />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-800">
                    {getFullName(selectedUser)}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <form onSubmit={updateUserRole}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  User Role
                </label>

                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <p className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 p-3 text-xs text-yellow-700">
                  Admin users can manage products, users, and orders.
                </p>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeRoleModal}
                    className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 py-3 font-semibold text-white hover:bg-pink-600 disabled:opacity-60"
                  >
                    {updateLoading && (
                      <Loader2 size={18} className="animate-spin" />
                    )}
                    {updateLoading ? "Updating..." : "Update Role"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User orders modal */}
      {showOrders && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center sm:p-5">
          <button
            type="button"
            onClick={closeOrdersModal}
            className="absolute inset-0 cursor-default"
            aria-label="Close orders"
          />

          <div className="relative max-h-[90vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-xl sm:max-w-3xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <ShoppingBag size={20} className="text-blue-600" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-gray-800">
                    {getFullName(selectedUser)}'s Orders
                  </h2>
                  <p className="truncate text-xs text-gray-500">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeOrdersModal}
                className="rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-4 sm:p-5">
              {ordersLoading && (
                <div className="flex flex-col items-center py-12">
                  <Loader2 size={30} className="animate-spin text-blue-500" />
                  <p className="mt-3 text-sm text-gray-500">
                    Loading orders...
                  </p>
                </div>
              )}

              {!ordersLoading && userOrders.length === 0 && (
                <div className="py-12 text-center">
                  <Package size={42} className="mx-auto text-gray-300" />
                  <p className="mt-3 font-medium text-gray-700">
                    No orders found
                  </p>
                </div>
              )}

              {!ordersLoading && userOrders.length > 0 && (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <article
                      key={order._id}
                      className="overflow-hidden rounded-xl border border-gray-200"
                    >
                      <div className="flex flex-col gap-3 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Order ID</p>
                          <p className="truncate text-sm font-semibold text-gray-800">
                            #{order.razorpayOrderId || order._id}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar size={14} />
                            {formatDate(order.createdAt)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status || "pending"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-3">
                          {order.products?.map((item, index) => {
                            const product = item.productId;

                            return (
                              <div
                                key={product?._id || index}
                                className="flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-gray-800">
                                    {product?.productname ||
                                      product?.name ||
                                      "Product"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Quantity: {item.quantity || 1}
                                  </p>
                                </div>

                                <p className="shrink-0 text-sm font-semibold">
                                  ₹
                                  {formatPrice(
                                    product?.productprice || product?.price
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 space-y-2 border-t border-dashed pt-4 text-sm">
                          <div className="flex justify-between text-gray-500">
                            <span>Tax</span>
                            <span>₹{formatPrice(order.tax)}</span>
                          </div>

                          <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span>
                              {Number(order.shipping || 0) === 0
                                ? "FREE"
                                : `₹${formatPrice(order.shipping)}`}
                            </span>
                          </div>

                          <div className="flex justify-between border-t pt-3 text-base font-bold text-gray-800">
                            <span>Total</span>
                            <span className="text-pink-600">
                              ₹{formatPrice(order.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminUser;