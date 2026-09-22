import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ adminOnly = false }) => {

    const { user } = useSelector((state) => state.user);

    // USER NOT LOGGED IN

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ADMIN ONLY ROUTE

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // AUTHORIZED USER

    return <Outlet />;
};

export default ProtectedRoute;
