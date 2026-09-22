import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Loader2, Package, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { serverURL } from "@/App";

const emptyProduct = {
  productname: "",
  productdesc: "",
  productprice: "",
  category: "",
  brand: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-50";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editData, setEditData] = useState(emptyProduct);

  const getConfig = () => {
    const token = localStorage.getItem("accessToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${serverURL}/api/product/get`,
        getConfig()
      );

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Get products error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      product.productname?.toLowerCase().includes(value) ||
      product.brand?.toLowerCase().includes(value) ||
      product.category?.toLowerCase().includes(value)
    );
  });

  const openEditModal = (product) => {
    setSelectedProduct(product);

    setEditData({
      productname: product.productname || "",
      productdesc: product.productdesc || "",
      productprice: product.productprice || "",
      category: product.category || "",
      brand: product.brand || "",
    });
  };

  const closeEditModal = () => {
    if (updateLoading) return;

    setSelectedProduct(null);
    setEditData(emptyProduct);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to remove this product?"
    );

    if (!shouldDelete) return;

    try {
      setDeleteLoading(productId);

      await axios.delete(
        `${serverURL}/api/product/delete/${productId}`,
        getConfig()
      );

      setProducts((previousProducts) =>
        previousProducts.filter((product) => product._id !== productId)
      );

      toast.success("Product removed successfully");
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(
        error.response?.data?.message || "Unable to remove product"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const fieldsAreEmpty = Object.values(editData).some(
      (value) => !String(value).trim()
    );

    if (fieldsAreEmpty) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setUpdateLoading(true);

      await axios.put(
        `${serverURL}/api/product/update/${selectedProduct._id}`,
        editData,
        {
          ...getConfig(),
          headers: {
            ...getConfig().headers,
            "Content-Type": "application/json",
          },
        }
      );

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product._id === selectedProduct._id
            ? { ...product, ...editData }
            : product
        )
      );

      toast.success("Product updated successfully");
      closeEditModal();
    } catch (error) {
      console.error("Update product error:", error);

      toast.error(
        error.response?.data?.message || "Unable to update product"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const ProductImage = ({ product, size = "h-14 w-14" }) => {
    const image = product.productImg?.[0]?.Url;

    return (
      <div
        className={`${size} shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100`}
      >
        {image ? (
          <img
            src={image}
            alt={product.productname}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={20} className="text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  const ActionButtons = ({ product }) => {
    const isDeleting = deleteLoading === product._id;

    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openEditModal(product)}
          className="flex items-center justify-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-100"
        >
          <Edit size={16} />
          <span className="sm:hidden">Edit</span>
        </button>

        <button
          type="button"
          onClick={() => handleDelete(product._id)}
          disabled={isDeleting}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          <span className="sm:hidden">Remove</span>
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
              <Package size={23} className="text-pink-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage products in your store
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Total products:{" "}
            <span className="font-semibold text-pink-600">
              {products.length}
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
              placeholder="Search products, brands or categories..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-50"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12">
            <Loader2 size={30} className="animate-spin text-pink-500" />
            <p className="mt-3 text-sm text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <Package size={40} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              {search ? "No products found" : "No products available"}
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
                      Product
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Brand
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Category
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Price
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage product={product} />

                          <div className="min-w-0">
                            <p className="max-w-55 truncate font-semibold text-gray-800">
                              {product.productname}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              ID: {product._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.brand || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium capitalize text-pink-600">
                          {product.category || "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-gray-800">
                        ₹{product.productprice || 0}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <ActionButtons product={product} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredProducts.map((product) => (
                <article key={product._id} className="p-4">
                  <div className="flex gap-3">
                    <ProductImage product={product} size="h-20 w-20" />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-800">
                          {product.productname}
                        </h2>

                        <p className="shrink-0 text-sm font-bold text-pink-600">
                          ₹{product.productprice || 0}
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.brand || "N/A"}
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium capitalize text-pink-600">
                        {product.category || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ActionButtons product={product} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center sm:p-5">
          <button
            type="button"
            onClick={closeEditModal}
            className="absolute inset-0 cursor-default"
            aria-label="Close edit modal"
          />

          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-xl sm:max-w-xl sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Product
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Update product information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={updateLoading}
                className="rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
                aria-label="Close edit modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  name="productname"
                  value={editData.productname}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    name="brand"
                    value={editData.brand}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="productprice"
                    min="0"
                    value={editData.productprice}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={editData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  <option value="fashion">Fashion</option>
                  <option value="electronics">Electronics</option>
                  <option value="shoes">Shoes</option>
                  <option value="beauty">Beauty</option>
                  <option value="home">Home</option>
                  <option value="sports">Sports</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Description
                </label>
                <textarea
                  name="productdesc"
                  rows="4"
                  value={editData.productdesc}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeEditModal}
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
                  {updateLoading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminProducts;