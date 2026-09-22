import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import Cart from "./pages/Cart";

import DashBoard from "./pages/DashBoard";

import AddProduct from "./pages/admins/AddProduct";
import AdminsOrder from "./pages/admins/AdminsOrder";
import AdminProducts from "./pages/admins/AdminProducts";
import AdminSales from "./pages/admins/AdminSales";
import AdminUser from "./pages/admins/AdminUsers";
import ShowUsersOrder from "./pages/admins/ShowUsersOrder";
import UserInfo from "./pages/admins/UserInfo";
import SingleProduct from "./pages/SingleProduct"
import ProtectedRoute from "./components/ProtectedRoute";
import AdressForm from "./pages/AdressForm";
import Wishlist from "./pages/Wishlist"

export const serverURL = "http://localhost:5000";

const router = createBrowserRouter([

  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    )
  },


  // =====================================
  // AUTH
  // =====================================

  {
    path: "/login",
    element: <Login />
  },

  {
    path: "/signup",
    element: <Signup />
  },

  {
    path: "/verify",
    element: <Verify />
  },

  {
    path: "/verify/:token",
    element: <VerifyEmail />
  },


  // =====================================
  // PROFILE
  // =====================================

  {
    path: "/profile/:userId",
    element: (
      <>
        <Navbar />
        <Profile />
      </>
    )
  },


  // =====================================
  // PRODUCTS
  // =====================================

  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Product />
      </>
    )
  },
  // {
  //     path: "/products/:productId",
  //     element: (
  //         <>
  //             <Navbar />
  //             <SingleProduct />
  //         </>
  //     )
  // },
  {
    path: "/product/:productId",
    element: (
      <>
        <Navbar />
        <SingleProduct />
      </>
    )
  },


  // =====================================
  // CART
  // =====================================

  {
    path: "/cart",
    element: (
      <>
        <Navbar />
        <Cart />
      </>
    )
  },
   {
    path: "/adress",
    element: (
      <>
        <AdressForm/>
      </>
    )
  },
   {
    path: "/wishlist",
    element: (
      <>
        <Wishlist />
      </>
    )
  },


  // =====================================
  // ADMIN DASHBOARD
  // =====================================

  {
    element: <ProtectedRoute adminOnly={true} />,

    children: [

      {
        path: "/dashboard",

        element: <><Navbar /><DashBoard /></>,

        children: [

          {
            path: "add",
            element: <AddProduct />
          },

          {
            path: "orders",
            element: <AdminsOrder />
          },

          {
            path: "products",
            element: <AdminProducts />
          },

          {
            path: "sales",
            element: <AdminSales />
          },

          {
            path: "user",
            element: <AdminUser />
          },

          {
            path: "user/orders/:userId",
            element: <ShowUsersOrder />
          },

          {
            path: "user/:id",
            element: <UserInfo />
          }

        ]
      }

    ]
  }

]);


const App = () => {

  return (
    <RouterProvider router={router} />
  );

};


export default App;

