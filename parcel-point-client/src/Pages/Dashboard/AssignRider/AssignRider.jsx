import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaMotorcycle,
} from "react-icons/fa";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Get parcels that are paid but not yet collected
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

  // Get all active riders
  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["activeRidersForAssignment"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=active");
      return res.data;
    },
  });

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
  };

  const closeModal = () => {
    setSelectedParcel(null);
  };

  const getMatchingRiders = () => {
    if (!selectedParcel || !riders) return [];

    return riders.filter((rider) => {
      return (
        rider.region === selectedParcel.senderRegion ||
        rider.district === selectedParcel.senderDistrict ||
        rider.warehouse === selectedParcel.senderWarehouse
      );
    });
  };

  const matchingRiders = getMatchingRiders();

  if (isLoading || ridersLoading) return <Loader />;
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
                <th>From → To</th>
                <th>Sender</th>
                <th>Receiver</th>
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
                    {parcel.senderRegion} → {parcel.receiverRegion}
                  </td>
                  <td>{parcel.senderName}</td>
                  <td>{parcel.receiverName}</td>
                  <td>{parcel.parcelWeight} kg</td>
                  <td>৳{parcel.totalCost}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssignClick(parcel)}
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

      {/* Modal */}
      {selectedParcel && (
        <div className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-semibold mb-4 text-[#03373D]">
              Assign Rider for: {selectedParcel.trackingId}
            </h3>

            {matchingRiders.length > 0 ? (
              <div className="space-y-4">
                {matchingRiders.map((rider) => (
                  <div
                    key={rider._id}
                    className="border rounded p-3 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-lg">{rider.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaEnvelope /> {rider.email} | <FaPhoneAlt />{" "}
                        {rider.contact}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <FaMapMarkerAlt /> {rider.region}, {rider.district},{" "}
                        {rider.warehouse}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <FaMotorcycle /> {rider.bikeBrand} (
                        {rider.bikeRegNumber})
                      </p>
                    </div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={async () => {
                        const confirm = await Swal.fire({
                          title: "Confirm Assignment",
                          text: `Assign parcel ${selectedParcel.trackingId} to ${rider.name}?`,
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonText: "Yes, Assign",
                        });

                        if (confirm.isConfirmed) {
                          try {
                            // 1. Update parcel delivery status
                            await axiosSecure.patch(
                              `/parcels/${selectedParcel._id}/status`,
                              {
                                deliveryStatus: "in-transit",
                              }
                            );

                            // 2. Update rider status
                            await axiosSecure.patch(`/riders/${rider._id}`, {
                              status: "in-delivery",
                              email: rider.email, // If your backend requires it
                            });

                            Swal.fire(
                              "Success",
                              "Rider assigned and statuses updated.",
                              "success"
                            );

                            // Optionally refetch parcels
                            // queryClient.invalidateQueries(["assignableParcels"]);

                            // Close modal
                            closeModal();
                          } catch (err) {
                            console.error(err);
                            Swal.fire(
                              "Error",
                              err.response?.data?.message ||
                                "Failed to assign rider.",
                              "error"
                            );
                          }
                        }
                      }}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No matching riders found for sender’s region/district/warehouse.
              </p>
            )}

            <div className="mt-6 text-right">
              <button className="btn btn-outline" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
