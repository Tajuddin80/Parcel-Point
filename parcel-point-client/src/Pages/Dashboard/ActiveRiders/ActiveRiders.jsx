import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: approvedRiders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["approvedRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/approved");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center text-lg font-medium text-blue-500">
        Loading approved riders...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load riders: {error.message}
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#03373D]">
        Active Riders
      </h2>

      {approvedRiders.length === 0 ? (
        <p className="text-center text-gray-500">No approved riders found.</p>
      ) : (
        <div className="overflow-x-auto shadow border rounded-lg">
          <table className="table w-full table-zebra text-sm">
            <thead className="bg-[#03373D] text-white text-base">
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
                    {rider.bikeBrand} ({rider.bikeRegNumber})
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
