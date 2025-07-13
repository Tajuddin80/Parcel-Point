import useUserRole from "../../../hooks/useUserRole";
import Forbidden from "../../Forbidden/Forbidden";
import Loader from "../../shared/Loader/Loader";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";

const DashboardHome = () => {
  const { role, roleLoading, isRoleError } = useUserRole();

  if (roleLoading) return <Loader />;

  if (isRoleError) {
    return <Loader></Loader>;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "rider") {
    return <RiderDashboard />;
  } else if (role === "usr") {
    return <UserDashboard />;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default DashboardHome;
