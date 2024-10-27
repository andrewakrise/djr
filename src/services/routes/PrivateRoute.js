// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../../components/auth/IsTokenValid";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
