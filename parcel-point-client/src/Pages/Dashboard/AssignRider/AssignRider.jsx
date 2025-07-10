import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels?status=assignable");
      return res.data;
    },
  });

  const handleAssignRider = (parcel) => {
    Swal.fire("Assign Rider", `Assign rider to parcel ${parcel.trackingId}`, "info");
    // TODO: Open modal or redirect to assign rider page
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load parcels: {error.message}
      </div>
    );

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-bold text-center text-[#03373D] mb-6">
        Parcels Ready to Assign Riders
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No parcels found that are paid but not yet collected.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border shadow">
          <table className="table table-zebra w-full text-sm md:text-base">
            <thead className="bg-[#03373D] text-white">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Parcel Name</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>From → To</th>
                <th>Weight</th>
                <th>Cost</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.trackingId}</td>
                  <td>{parcel.parcelName}</td>
                  <td>
                    {parcel.senderName} <br />
                    <span className="text-xs text-gray-500">
                      {parcel.senderContact}
                    </span>
                  </td>
                  <td>
                    {parcel.receiverName} <br />
                    <span className="text-xs text-gray-500">
                      {parcel.receiverContact}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold">
                      {parcel.senderRegion}
                    </span>{" "}
                    →{" "}
                    <span className="font-semibold">
                      {parcel.receiverRegion}
                    </span>
                  </td>
                  <td>{parcel.parcelWeight} kg</td>
                  <td>৳{parcel.totalCost}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssignRider(parcel)}
                    >
                      Assign Rider
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

export default AssignRider;
