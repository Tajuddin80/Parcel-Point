import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState(""); // New role filter state

  // Query to search users by email and role
  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["searchUsers", searchEmail, searchRole],
    enabled: !!searchEmail || !!searchRole,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/search?email=${searchEmail}&role=${searchRole}`
      );
      return res.data;
    },
  });

  // Mutation to update role
  const { mutate: updateRole, isPending } = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/users/${id}/role`, { role });
      return res.data;
    },
    onSuccess: (data) => {
      Swal.fire("Success", data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    },
  });

  const handleRoleChange = (id, newRole) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You are about to make this user a ${newRole.toUpperCase()}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update role!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRole({ id, role: newRole });
      }
    });
  };

  return (
    <section className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#03373D] mb-4">Make Admin</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Email Search */}
        <input
          type="text"
          placeholder="Search by email..."
          className="input input-bordered w-full max-w-md"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />

        {/* Role Filter */}
        <select
          className="select select-bordered"
          value={searchRole}
          onChange={(e) => setSearchRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="rider">Rider</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Loading State */}
      {isFetching && <Loader />}

      {/* User List */}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created Account</th>
                <th>Set As</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"}
                  </td>
                  <td className="space-x-2">
                    {user.role !== "admin" && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleRoleChange(user._id, "admin")}
                        disabled={isPending}
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== "user" && user.role !== "rider" && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleRoleChange(user._id, "user")}
                        disabled={isPending}
                      >
                        Revoke Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        (searchEmail || searchRole) &&
        !isFetching && <p className="text-gray-500">No matching users found.</p>
      )}
    </section>
  );
};

export default MakeAdmin;
