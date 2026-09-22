import { serverURL } from "@/App";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ======================================================
// ADD TO CART
// ======================================================

export const addToCart = createAsyncThunk(
  "cart/addToCart",

  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return rejectWithValue("Please login first");
      }

      const res = await axios.post(
        `${serverURL}/api/cart/add`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to add product to cart"
      );
    }
  }
);

// ======================================================
// GET CART
// ======================================================

export const getCart = createAsyncThunk(
  "cart/getCart",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return rejectWithValue("Please login first");
      }

      const res = await axios.get(
        `${serverURL}/api/cart/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("GET CART ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to fetch cart"
      );
    }
  }
);

// ======================================================
// UPDATE QUANTITY
// ======================================================

export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",

  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return rejectWithValue("Please login first");
      }

      const res = await axios.put(
        `${serverURL}/api/cart/update`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("UPDATE CART ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to update cart"
      );
    }
  }
);

// ======================================================
// REMOVE SINGLE PRODUCT
// ======================================================

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",

  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return rejectWithValue("Please login first");
      }

      if (!productId) {
        return rejectWithValue("Product ID is required");
      }

      const res = await axios.delete(
        `${serverURL}/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("REMOVE CART ITEM ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to remove product"
      );
    }
  }
);

// ======================================================
// EMPTY COMPLETE CART
// ======================================================

export const clearCart = createAsyncThunk(
  "cart/clearCart",

  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return rejectWithValue("Please login first");
      }

      const res = await axios.delete(
        `${serverURL}/api/cart/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("CLEAR CART ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to clear cart"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  cart: [],
  totalPrice: 0,
  loading: false,
  error: null,
  success: false,
};

// ======================================================
// CART SLICE
// ======================================================

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    clearCartState: (state) => {
      state.cart = [];
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // ADD TO CART
    // ==================================================

    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        const cartData = action.payload?.cart;

        state.cart = Array.isArray(cartData?.items)
          ? cartData.items
          : [];

        state.totalPrice = Number(
          cartData?.totalPrice || 0
        );
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

    // ==================================================
    // GET CART
    // ==================================================

    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const cartData = action.payload?.cart;

        state.cart = Array.isArray(cartData?.items)
          ? cartData.items
          : [];

        state.totalPrice = Number(
          cartData?.totalPrice || 0
        );
      })

      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.cart = [];
        state.totalPrice = 0;
      });

    // ==================================================
    // UPDATE QUANTITY
    // ==================================================

    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        const cartData = action.payload?.cart;

        state.cart = Array.isArray(cartData?.items)
          ? cartData.items
          : [];

        state.totalPrice = Number(
          cartData?.totalPrice || 0
        );
      })

      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==================================================
    // REMOVE SINGLE PRODUCT
    // ==================================================

    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        const cartData = action.payload?.cart;

        state.cart = Array.isArray(cartData?.items)
          ? cartData.items
          : [];

        state.totalPrice = Number(
          cartData?.totalPrice || 0
        );
      })

      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==================================================
    // EMPTY COMPLETE CART
    // ==================================================

    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.cart = [];
        state.totalPrice = 0;
      })

      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;