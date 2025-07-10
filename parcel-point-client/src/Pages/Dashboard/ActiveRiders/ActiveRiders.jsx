import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch approved riders
  const {
    data: approvedRiders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["approvedRiders"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=active");

      return res.data;
    },
  });

  // Mutation to deactivate rider
  const { mutate: deactivateRider, isPending: isDeactivating } = useMutation({
    mutationFn: async ({ id, email }) => {
      const res = await axiosSecure.patch(`/riders/${id}`, {
        status: "rejected", // or "pending" if you prefer
        email,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Rider deactivated", "success");
      queryClient.invalidateQueries({ queryKey: ["approvedRiders"] });
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    },
  });

  const handleDeactivate = (id, email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will deactivate the rider's account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
    }).then((result) => {
      if (result.isConfirmed) {
        deactivateRider({ id, email });
      }
    });
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load riders: {error.message}
      </div>
    );

  return (
    <div className="">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#03373D]">
        Active Riders
      </h2>

      {approvedRiders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No approved riders found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border shadow">
          <table className="table w-full table-zebra text-base md:text-lg">
            <thead className="bg-[#03373D] text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Region</th>
                <th>District</th>
                <th>Warehouse</th>
                <th>Bike</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td className="font-semibold">{rider.name}</td>
                  <td>{rider.contact}</td>
                  <td>{rider.email}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>{rider.warehouse}</td>
                  <td>
                    {rider.bikeBrand} <br className="md:hidden" />
                    <span className="text-sm text-gray-600">
                      ({rider.bikeRegNumber})
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeactivate(rider._id, rider.email)}
                      disabled={isDeactivating}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
