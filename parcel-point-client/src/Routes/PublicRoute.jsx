// import React from "react";
// import { Navigate, useLocation } from "react-router";
// import useAuth from "../hooks/useAuth";

// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <span className="loading loading-spinner loading-xl"></span>;
//   }

//   if (user) {
//     // Redirect authenticated users to home or where they came from
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default PublicRoute;
