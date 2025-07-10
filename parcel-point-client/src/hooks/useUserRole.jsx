import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading:authLoading } = useAuth(); // your existing auth context
  const axiosSecure = useAxiosSecure();

  const { data: role ='user', isLoading : roleLoading, isError,refetch } = useQuery({
      
      
      queryKey: ["userRole", user?.email],
      enabled: !authLoading && !!user?.email, // wait for user to load
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    },
  });

  return {
    role,
    roleLoading: authLoading || roleLoading,
    isRoleError: isError,
    refetch
  };
};

export default useUserRole;
