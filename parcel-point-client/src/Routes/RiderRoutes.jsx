import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import Loader from "../Pages/shared/Loader/Loader";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (!user || role !== "rider") {
    return <Navigate to={"/forbidden"}></Navigate>;
  }

  return children;
};

export default RiderRoute;
