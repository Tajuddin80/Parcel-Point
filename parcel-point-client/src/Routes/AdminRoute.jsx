import React from "react";
import useAuth from "../hooks/useAuth";
import Loader from "../Pages/shared/Loader/Loader";
import useUserRole from "../hooks/useUserRole";
import { Navigate } from "react-router";

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const { role, isRoleLoading } = useUserRole();

  if (loading || isRoleLoading) {
    return <Loader></Loader>;
  }

  if (!user || role !== "admin") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden">
      </Navigate>
    );
  }
  return <div>AdminRoute</div>;
};

export default AdminRoute;
