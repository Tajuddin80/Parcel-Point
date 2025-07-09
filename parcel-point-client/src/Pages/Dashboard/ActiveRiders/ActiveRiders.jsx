import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import useAuth from "../../../hooks/useAuth";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {
    data: approvedRiders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["approvedRiders"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/approved");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loader></Loader>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load riders: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
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
