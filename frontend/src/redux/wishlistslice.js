import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlist: [],
    loading: false,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action) => {
            state.wishlist = action.payload;
        },
        addWishlistItem: (state, action) => {
            state.wishlist.push(action.payload);
        },
        removeWishlistItem: (state, action) => {
            state.wishlist = state.wishlist.filter(
                (item) => item.productId._id !== action.payload
            );
        },
        clearWishlist: (state) => {
            state.wishlist = [];
        },
        setWishlistLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setWishlist,
    addWishlistItem,
    removeWishlistItem,
    clearWishlist,
    setWishlistLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// export const getWishlist
// export const addToWishlist
// export const removeFromWishlist
// export const clearWishlist