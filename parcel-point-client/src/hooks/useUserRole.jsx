import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading } = useAuth(); // your existing auth context
  const axiosSecure = useAxiosSecure();

  const { data: roleData, isPending, isError } = useQuery({
    enabled: !loading && !!user?.email, // wait for user to load
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data;
    },
  });

  return {
    role: roleData?.role || "user",
    isRoleLoading: isPending,
    isRoleError: isError,
  };
};

export default useUserRole;
