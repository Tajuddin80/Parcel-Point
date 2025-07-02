import React from "react";
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }
  if (user) {
    return <Navigate to="/"></Navigate>;
  }
  return children;
};

export default PublicRoute;
