import { serverURL } from "@/App";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${serverURL}/api/product/get`
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Unable to fetch products"
            );
        }
    }
);

const initialState = {
    products: [],
    loading: false,
    error: null,
};

const ProductSlice = createSlice({
    name: "product",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })

            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ProductSlice.reducer;