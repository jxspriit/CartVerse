import userSlice from "./userSlice";
import productSlice from "./ProductSlice";
import cartSlice from "./CartSlice";
import orderSlice from "./OrderSlice";
import wishlistReducer from "./wishlistslice"

import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
persistReducer,
FLUSH,
REHYDRATE,
PAUSE,
PERSIST,
PURGE,
REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

const persistConfig = {
key: "root",
version: 1,
storage,
};

const rootReducer = combineReducers({


// User Redux
user: userSlice,

// Product Redux
product: productSlice,

// Cart Redux
cart: cartSlice,

// Order Redux
order: orderSlice,

wishlist: wishlistReducer,


});

const persistedReducer = persistReducer(
persistConfig,
rootReducer
);

const store = configureStore({


reducer: persistedReducer,

middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

        serializableCheck: {
            ignoredActions: [
                FLUSH,
                REHYDRATE,
                PAUSE,
                PERSIST,
                PURGE,
                REGISTER,
            ],
        },

    }),

});

export default store;
