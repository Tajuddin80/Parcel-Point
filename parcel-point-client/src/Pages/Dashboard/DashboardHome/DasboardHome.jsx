import useUserRole from "../../../hooks/useUserRole";
import Loader from "../../shared/Loader/Loader";
import {
  AdminDashboard,
  RiderDashboard,
  UserDashboard,
} from "./DashboardWrapper";

const DashboardHome = () => {
  const { role, roleLoading, isRoleError } = useUserRole();

  if (roleLoading) return <Loader />;

  if (isRoleError) {
    return <Loader></Loader>;
  }

  if (role === "admin") return <AdminDashboard />;
  if (role === "rider") return <RiderDashboard />;
  return <UserDashboard />;
};

export default DashboardHome;
