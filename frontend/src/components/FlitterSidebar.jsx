import React, { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Search
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const FlitterSidebar = ({
  allProducts = [],

  // Search
  search,
  setSearch,

  // Category
  selectedCategory,
  setSelectedCategory,

  // Brand
  selectedBrand,
  setSelectedBrand,

  // Price
  priceRange,
  setPriceRange
}) => {

  const [categoryOpen, setCategoryOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);


  // ==========================================
  // DYNAMIC CATEGORIES
  // ==========================================

  const categories = [
    "All",
    ...new Set(
      allProducts
        .map((product) => product.category)
        .filter(Boolean)
    )
  ];


  // ==========================================
  // DYNAMIC BRANDS
  // ==========================================

  const brands = [
    "All",
    ...new Set(
      allProducts
        .map((product) => product.brand)
        .filter(Boolean)
    )
  ];


  // ==========================================
  // PRICE CHANGE
  // ==========================================

  const handlePriceChange = (index, value) => {

    const newPriceRange = [...priceRange];

    newPriceRange[index] = Number(value);

    setPriceRange(newPriceRange);
  };


  // ==========================================
  // CLEAR ALL FILTERS
  // ==========================================

  const clearFilters = () => {

    setSearch("");

    setSelectedCategory("All");

    setSelectedBrand("All");

    setPriceRange([0, 100000]);

  };


  return (

    <aside className="w-64 shrink-0">

      <div className="bg-white border border-gray-200 rounded-xl p-5">


        {/* ================================= */}
        {/* FILTER HEADER */}
        {/* ================================= */}

        <div className="flex items-center justify-between pb-4 border-b">

          <div className="flex items-center gap-2">

            <SlidersHorizontal size={20} />

            <h2 className="text-lg font-semibold">
              Filters
            </h2>

          </div>


          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-black"
          >
            Clear
          </button>

        </div>


        {/* ================================= */}
        {/* SEARCH */}
        {/* ================================= */}

        <div className="py-5 border-b">

          <label className="text-sm font-semibold">
            Search Products
          </label>


          <div className="relative mt-3">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />


            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:border-black"
            />

          </div>

        </div>


        {/* ================================= */}
        {/* CATEGORY */}
        {/* ================================= */}

        <div className="py-5 border-b">

          <button
            type="button"
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="w-full flex items-center justify-between"
          >

            <span className="font-semibold">
              Category
            </span>


            {categoryOpen
              ? <ChevronUp size={18} />
              : <ChevronDown size={18} />
            }

          </button>


          {categoryOpen && (

            <div className="mt-4 space-y-3">

              {categories.map((category) => (

                <label
                  key={category}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >

                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() =>
                      setSelectedCategory(category)
                    }
                    className="w-4 h-4 accent-black"
                  />


                  <span>
                    {category}
                  </span>

                </label>

              ))}

            </div>

          )}

        </div>


        {/* ================================= */}
        {/* BRAND */}
        {/* ================================= */}

        <div className="py-5 border-b">

          <button
            type="button"
            onClick={() => setBrandOpen(!brandOpen)}
            className="w-full flex items-center justify-between mb-4"
          >

            <span className="font-semibold">
              Brand
            </span>


            {brandOpen
              ? <ChevronUp size={18} />
              : <ChevronDown size={18} />
            }

          </button>


          {brandOpen && (

            <Select
              value={selectedBrand}
              onValueChange={setSelectedBrand}
            >

              <SelectTrigger className="w-full">

                <SelectValue placeholder="Select brand" />

              </SelectTrigger>


              <SelectContent>

                {brands.map((brand) => (

                  <SelectItem
                    key={brand}
                    value={brand}
                  >

                    {brand.toUpperCase()}

                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          )}

        </div>


        {/* ================================= */}
        {/* PRICE */}
        {/* ================================= */}

        <div className="py-5">

          <button
            type="button"
            onClick={() => setPriceOpen(!priceOpen)}
            className="w-full flex items-center justify-between mb-4"
          >

            <span className="font-semibold">
              Price
            </span>


            {priceOpen
              ? <ChevronUp size={18} />
              : <ChevronDown size={18} />
            }

          </button>


          {priceOpen && (

            <div className="space-y-4">


              {/* MIN / MAX */}

              <div className="flex gap-2">


                {/* MIN */}

                <div className="w-1/2">

                  <label className="text-xs text-gray-500">
                    Min
                  </label>


                  <input
                    type="number"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange(
                        0,
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
                  />

                </div>


                {/* MAX */}

                <div className="w-1/2">

                  <label className="text-xs text-gray-500">
                    Max
                  </label>


                  <input
                    type="number"
                    min="0"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange(
                        1,
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-black"
                  />

                </div>

              </div>


              {/* PRICE SLIDER */}

              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceChange(
                    1,
                    e.target.value
                  )
                }
                className="w-full accent-black"
              />


              {/* PRICE VALUES */}

              <div className="flex justify-between text-xs text-gray-500">

                <span>
                  ₹{priceRange[0]}
                </span>

                <span>
                  ₹{priceRange[1]}
                </span>

              </div>

            </div>

          )}

        </div>

      </div>

    </aside>

  );
};


export default FlitterSidebar;
