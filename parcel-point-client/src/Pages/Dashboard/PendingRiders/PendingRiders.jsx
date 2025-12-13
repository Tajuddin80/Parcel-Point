
import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../shared/Loader/Loader";
import { Helmet } from "react-helmet";

const PendingRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    data: riders = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const handleDecision = async (riderId, action, email) => {
    const confirmResult = await Swal.fire({
      title: `Are you sure you want to ${action} this rider?`,
      text:
        action === "approved"
          ? "The rider will be marked as active."
          : "This rider will be rejected and deleted permanently!",
      icon: action === "approved" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: action === "approved" ? "#3085d6" : "#d33",
    });

    if (!confirmResult.isConfirmed) return;

    if (action === "approved") {
      const secondConfirm = await Swal.fire({
        title: "Confirm Final Approval",
        text: "Once approved, this rider will be active and can deliver parcels. Proceed?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Confirm Approval",
        cancelButtonText: "Cancel",
      });

      if (!secondConfirm.isConfirmed) return;
    }

    try {
      setIsApproving(true);

      const patchResponse = await axiosSecure.patch(`/riders/${riderId}`, {
        status: action === "approved" ? "active" : "rejected",
        email,
      });

      const patchOk =
        patchResponse?.data?.modifiedCount > 0 ||
        patchResponse?.data?.acknowledged;

      if (action === "approved" && patchOk) {
        Swal.fire("Rider approved!", "", "success");
      }

      if (action === "rejected" && patchOk) {
        const deleteResponse = await axiosSecure.delete(`/riders/${riderId}`);
        if (deleteResponse?.data?.deletedCount > 0) {
          Swal.fire("Rider rejected and deleted!", "", "success");
        }
      }

      // Close modal and refresh table
      setModalOpen(false);
      setSelectedRider(null);
      refetch();
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#03373D]">
        Pending Riders
      </h2>
       <Helmet>
        <title>Parcel Point | Pending Riders</title>
      </Helmet>

      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="table table-zebra w-full text-base md:text-lg">
          <thead className="bg-[#03373D] text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Region</th>
              <th>District</th>
              <th>Warehouse</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Bike</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td className="font-semibold">{rider.name}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.warehouse}</td>
                <td>{rider.contact}</td>
                <td>{rider.email}</td>
                <td>{rider.bikeBrand}</td>
                <td>
                  <button
                    className="btn btn-sm md:btn-md btn-info"
                    onClick={() => {
                      setSelectedRider(rider);
                      setModalOpen(true);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedRider && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/40 flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-2xl relative text-base md:text-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-[#03373D]">
              Rider Application
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={
                  selectedRider.photoURL || "https://via.placeholder.com/200"
                }
                alt="Rider"
                className="w-full md:w-1/2 rounded-xl shadow"
              />
              <ul className="space-y-1 w-full">
                <li>
                  <strong>Name:</strong> {selectedRider.name}
                </li>
                <li>
                  <strong>Age:</strong> {selectedRider.age}
                </li>
                <li>
                  <strong>Email:</strong> {selectedRider.email}
                </li>
                <li>
                  <strong>Region:</strong> {selectedRider.region}
                </li>
                <li>
                  <strong>District:</strong> {selectedRider.district}
                </li>
                <li>
                  <strong>Warehouse:</strong> {selectedRider.warehouse}
                </li>
                <li>
                  <strong>Contact:</strong> {selectedRider.contact}
                </li>
                <li>
                  <strong>NID:</strong> {selectedRider.nid}
                </li>
                <li>
                  <strong>Bike Brand:</strong> {selectedRider.bikeBrand}
                </li>
                <li>
                  <strong>Bike Reg Number:</strong>{" "}
                  {selectedRider.bikeRegNumber}
                </li>
                <li>
                  <strong>Status:</strong>{" "}
                  <span className="badge badge-warning">
                    {selectedRider.status}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-4">
              <button
                className={`btn btn-success ${isApproving ? "btn-disabled" : ""}`}
                onClick={() =>
                  handleDecision(
                    selectedRider._id,
                    "approved",
                    selectedRider.email
                  )
                }
                disabled={isApproving}
              >
                {isApproving ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Approve"
                )}
              </button>
              <button
                className="btn btn-error"
                onClick={() =>
                  handleDecision(
                    selectedRider._id,
                    "rejected",
                    selectedRider.email
                  )
                }
                disabled={isApproving}
              >
                Reject
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedRider(null);
                }}
                disabled={isApproving}
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
