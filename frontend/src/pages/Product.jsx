import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlidersHorizontal, X } from "lucide-react";

import FlitterSidebar from "@/components/FlitterSidebar";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/redux/ProductSlice";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "default", label: "Sort by price" },
  { value: "low-to-high", label: "Price: low to high" },
  { value: "high-to-low", label: "Price: high to low" },
];

const Product = () => {
  const dispatch = useDispatch();

  const { products = [], loading, error } = useSelector(
    (state) => state.product
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sort, setSort] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const name = product.productname?.toLowerCase() || "";
      const description = product.productdesc?.toLowerCase() || "";
      const brand = product.brand?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const price = Number(product.productprice) || 0;

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        description.includes(searchText) ||
        brand.includes(searchText) ||
        category.includes(searchText);

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesBrand =
        selectedBrand === "All" || product.brand === selectedBrand;

      const matchesPrice =
        price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    if (sort === "low-to-high") {
      return result.sort(
        (a, b) => Number(a.productprice || 0) - Number(b.productprice || 0)
      );
    }

    if (sort === "high-to-low") {
      return result.sort(
        (a, b) => Number(b.productprice || 0) - Number(a.productprice || 0)
      );
    }

    return result;
  }, [products, search, selectedCategory, selectedBrand, priceRange, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setPriceRange([0, 100000]);
    setSort("default");
  };

  const filterProps = {
    allProducts: products,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    setPriceRange,
    clearFilters,
  };

  return (
    <main className="min-h-screen px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Mobile controls */}
        <div className="mb-5 flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="flex-1 bg-white">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>

            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Desktop filters */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <FlitterSidebar {...filterProps} />
          </aside>

          <section className="min-w-0 flex-1">
            {/* Desktop result and sort bar */}
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>

                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile product count */}
            <p className="mb-5 text-sm text-gray-500 lg:hidden">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            {loading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <ProductCard key={item} loading />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="py-20 text-center">
                <h2 className="text-xl font-semibold text-red-500">
                  Unable to fetch products
                </h2>
                <p className="mt-2 text-sm text-gray-500">{error}</p>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  No products found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filters popup */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen(false)}
            className="absolute inset-0 cursor-default bg-black/40"
            aria-label="Close filters"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <FlitterSidebar {...filterProps} />

            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="mt-5 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Product;