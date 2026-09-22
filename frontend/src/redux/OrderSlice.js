import { serverURL } from "@/App";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =====================================
// CREATE ORDER
// =====================================

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                return rejectWithValue(
                    "Access token not found. Please login again."
                );
            }

            const response = await axios.post(
                `${serverURL}/api/order/create`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;

        } catch (error) {
            console.error(
                "CREATE ORDER ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create order"
            );
        }
    }
);


// =====================================
// VERIFY PAYMENT
// =====================================

export const verifyPayment = createAsyncThunk(
    "order/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                return rejectWithValue(
                    "Access token not found. Please login again."
                );
            }

            const response = await axios.post(
                `${serverURL}/api/order/verify-payment`,
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;

        } catch (error) {
            console.error(
                "VERIFY PAYMENT ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                "Payment verification failed"
            );
        }
    }
);


// =====================================
// INITIAL STATE
// =====================================

const initialState = {
    loading: false,
    paymentLoading: false,

    error: null,
    paymentError: null,

    success: false,
    paymentSuccess: false,

    order: null,
    razorpayOrder: null,
};


// =====================================
// ORDER SLICE
// =====================================

const orderSlice = createSlice({

    name: "order",

    initialState,

    reducers: {

        resetOrder: (state) => {

            state.loading = false;
            state.paymentLoading = false;

            state.error = null;
            state.paymentError = null;

            state.success = false;
            state.paymentSuccess = false;

            state.order = null;
            state.razorpayOrder = null;

        },

    },


    // =====================================
    // EXTRA REDUCERS
    // =====================================

    extraReducers: (builder) => {


        // =====================================
        // CREATE ORDER
        // =====================================

        builder

            .addCase(
                createOrder.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                    state.success = false;

                }
            )


            .addCase(
                createOrder.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.success = true;

                    state.order =
                        action.payload.order;

                    state.razorpayOrder =
                        action.payload.razorpayOrder;

                }
            )


            .addCase(
                createOrder.rejected,
                (state, action) => {

                    state.loading = false;
                    state.success = false;

                    state.error =
                        action.payload;

                }
            );


        // =====================================
        // VERIFY PAYMENT
        // =====================================

        builder

            .addCase(
                verifyPayment.pending,
                (state) => {

                    state.paymentLoading = true;
                    state.paymentError = null;
                    state.paymentSuccess = false;

                }
            )


            .addCase(
                verifyPayment.fulfilled,
                (state, action) => {

                    state.paymentLoading = false;
                    state.paymentSuccess = true;

                    state.order =
                        action.payload.order;

                }
            )


            .addCase(
                verifyPayment.rejected,
                (state, action) => {

                    state.paymentLoading = false;
                    state.paymentSuccess = false;

                    state.paymentError =
                        action.payload;

                }
            );

    },

});


// =====================================
// EXPORT ACTIONS
// =====================================

export const {
    resetOrder,
} = orderSlice.actions;


// =====================================
// EXPORT REDUCER
// =====================================

export default orderSlice.reducer;
