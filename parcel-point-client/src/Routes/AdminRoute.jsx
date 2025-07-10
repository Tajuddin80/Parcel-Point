
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import Loader from "../Pages/shared/Loader/Loader";
import { Navigate } from "react-router";

const AdminRoute = ({children}) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (!user || role !== "admin") {
    return <Navigate to={'/forbidden'}></Navigate>
  }

 return children
};

export default AdminRoute;
