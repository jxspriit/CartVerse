import React, { useState } from "react";
import axios from "axios";
import {
  ImagePlus,
  X,
  Plus,
  Package,
  Tag,
  DollarSign,
  Layers,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { serverURL } from "@/App";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productname: "",
    productdesc: "",
    productprice: "",
    category: "",
    brand: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    // Only images
    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    // Maximum 5 images
    if (images.length + imageFiles.length > 5) {
      toast.error("You can upload maximum 5 images");

      const remainingSlots = 5 - images.length;

      if (remainingSlots > 0) {
        setImages((prev) => [
          ...prev,
          ...imageFiles.slice(0, remainingSlots),
        ]);
      }

      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...imageFiles]);

    // Allow selecting the same file again
    e.target.value = "";
  };

  // =========================
  // REMOVE IMAGE
  // =========================
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setFormData({
      productname: "",
      productdesc: "",
      productprice: "",
      category: "",
      brand: "",
    });

    setImages([]);
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields
    if (
      !formData.productname.trim() ||
      !formData.productdesc.trim() ||
      !formData.productprice ||
      !formData.category ||
      !formData.brand.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // Price validation
    if (Number(formData.productprice) <= 0) {
      toast.error("Product price must be greater than 0");
      return;
    }

    // Image validation
    if (images.length === 0) {
      toast.error("Please select at least one product image");
      return;
    }

    if (images.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // CREATE FORMDATA
      // =========================
      const data = new FormData();

      data.append("productname", formData.productname.trim());
      data.append("productdesc", formData.productdesc.trim());
      data.append("productprice", formData.productprice);
      data.append("category", formData.category);
      data.append("brand", formData.brand.trim());

      // IMPORTANT:
      // Backend multer expects "images"
      images.forEach((image) => {
        data.append("images", image);
      });

      console.log("Sending product data...");
      console.log("Images:", images.length);

      // =========================
      // API REQUEST
      // =========================
      const response = await axios.post(
        `${serverURL}/api/product/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADD PRODUCT RESPONSE:", response.data);

      if (response.data.success) {
        toast.success("Product added successfully!");

        resetForm();
      }
    } catch (error) {
      // console.log("========== ADD PRODUCT ERROR ==========");

      // console.log("AXIOS ERROR:", error);
      // console.log("STATUS:", error.response?.status);
      // console.log("BACKEND RESPONSE:", error.response?.data);
      // console.log("BACKEND MESSAGE:", error.response?.data?.message);
      console.log(error)

      toast.error(
        error.response?.data?.message || "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-8 bg-gray-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-6">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="mb-6 sm:mb-8 pt-10">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 shrink-0 rounded-xl bg-pink-100 flex items-center justify-center">
            <Package className="text-pink-600" size={23} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Add Product
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Create a new product for your store
            </p>
          </div>

        </div>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

          {/* =========================
              LEFT SIDE
          ========================== */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">

            {/* BASIC INFORMATION */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

              <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Basic Information
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Enter the basic details of your product
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-5">

                {/* PRODUCT NAME */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product Name
                  </label>

                  <div className="relative">
                    <Package
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="productname"
                      value={formData.productname}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition"
                    />
                  </div>
                </div>

                {/* BRAND + PRICE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* BRAND */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Brand
                    </label>

                    <div className="relative">
                      <Tag
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Enter brand"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition"
                      />
                    </div>
                  </div>

                  {/* PRICE */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Price
                    </label>

                    <div className="relative">
                      <DollarSign
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="number"
                        name="productprice"
                        value={formData.productprice}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="1"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition"
                      />
                    </div>
                  </div>

                </div>

                {/* CATEGORY */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </label>

                  <div className="relative">
                    <Layers
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition appearance-none"
                    >
                      <option value="">Select category</option>
                      <option value="fashion">Fashion</option>
                      <option value="electronics">Electronics</option>
                      <option value="shoes">Shoes</option>
                      <option value="beauty">Beauty</option>
                      <option value="home">Home</option>
                      <option value="sports">Sports</option>
                      <option value="accessories">
                        Accessories
                      </option>
                    </select>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product Description
                  </label>

                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-3 top-3 text-gray-400"
                    />

                    <textarea
                      name="productdesc"
                      value={formData.productdesc}
                      onChange={handleChange}
                      placeholder="Describe your product..."
                      rows="4"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none resize-none focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* =========================
                PRODUCT IMAGES
            ========================== */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

              <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
                <div className="flex justify-between items-center gap-3">

                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                      Product Images
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Upload up to 5 product images
                    </p>
                  </div>

                  <span className="text-xs font-medium text-gray-500">
                    {images.length}/5
                  </span>

                </div>
              </div>

              <div className="p-4 sm:p-6">

                {/* UPLOAD */}
                {images.length < 5 && (
                  <label
                    htmlFor="productImages"
                    className="group border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left cursor-pointer hover:border-pink-300 hover:bg-pink-50/40 transition"
                  >
                    <div className="w-11 h-11 shrink-0 rounded-full bg-pink-100 flex items-center justify-center group-hover:scale-105 transition">
                      <ImagePlus
                        size={22}
                        className="text-pink-600"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 text-sm sm:text-base">
                        Upload Product Images
                      </p>

                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Select up to {5 - images.length} more image
                        {5 - images.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <input
                      id="productImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                {/* PREVIEW */}
                {images.length > 0 && (
                  <div className="mt-6">

                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-semibold text-gray-700">
                        Selected Images
                      </p>

                      <span className="text-xs text-gray-400">
                        {images.length}/5
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">

                      {images.map((image, index) => (
                        <div
                          key={`${image.name}-${index}`}
                          className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                        >

                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition"
                          >
                            <X size={16} />
                          </button>

                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                            Image {index + 1}
                          </div>

                        </div>
                      ))}

                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* =========================
              RIGHT SIDE
          ========================== */}
          <div className="space-y-4 sm:space-y-6">

            {/* PRODUCT SUMMARY */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

              <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Product Summary
                </h2>
              </div>

              <div className="p-4 sm:p-6">

                <div className="space-y-4">

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Product
                    </span>

                    <span className="text-sm font-medium text-gray-800 text-right break-words max-w-[65%]">
                      {formData.productname || "Not added"}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Brand
                    </span>

                    <span className="text-sm font-medium text-gray-800 text-right break-words max-w-[65%]">
                      {formData.brand || "Not added"}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Category
                    </span>

                    <span className="text-sm font-medium text-gray-800 capitalize text-right break-words max-w-[65%]">
                      {formData.category || "Not selected"}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Price
                    </span>

                    <span className="text-lg font-bold text-pink-600">
                      ₹{formData.productprice || "0"}
                    </span>
                  </div>

                </div>

              </div>
            </div>

            {/* IMAGE COUNT */}
            <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 sm:p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 shrink-0 rounded-xl bg-white flex items-center justify-center">
                  <ImagePlus
                    size={20}
                    className="text-pink-600"
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-semibold text-pink-700">
                    Product Images
                  </p>

                  <p className="text-xs text-pink-500">
                    {images.length} image
                    {images.length !== 1 ? "s" : ""} selected
                  </p>

                </div>

              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 rounded-xl shadow-sm shadow-pink-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >

              <Plus size={20} />

              {loading
                ? "Adding Product..."
                : "Add Product"}

            </button>

            <p className="text-xs text-center text-gray-400 px-4">
              Make sure all product information is correct before adding.
            </p>

          </div>

        </div>
      </form>
    </div>
  );
};

export default AddProduct;