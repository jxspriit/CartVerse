import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Menu,
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Sales",
      path: "/dashboard/sales",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Add Product",
      path: "/dashboard/add",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      icon: <Package size={20} />,
    },
    {
      name: "Users",
      path: "/dashboard/user",
      icon: <Users size={20} />,
    },
  ];

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-4 z-30 flex items-center gap-2 rounded-full bg-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-700 lg:hidden"
      >
        <Menu size={19} />
        Menu
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white p-5 shadow-xl transition-transform duration-300 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-start justify-between border-b border-gray-100 px-3 pb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Manage your store
            </p>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-pink-100 font-semibold text-pink-600"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-500"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;