// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/" />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <div className="p-4 text-red-600">Access Denied</div>;
  }

  return children;
}
