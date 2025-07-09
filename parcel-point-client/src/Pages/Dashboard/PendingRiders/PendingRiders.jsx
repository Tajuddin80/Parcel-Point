import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PendingRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Fetch pending riders
  const {
    data: riders = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pending");
      return res.data;
    },
  });

  // Approve or Reject
 const handleDecision = async (riderId, action) => {
  try {
    let patchResponse;
    let deleteResponse;

    if (action === "approved") {
      // Approve: update status only
      patchResponse = await axiosSecure.patch(`/riders/${riderId}`, {
        status: "approved",
      });

      if (patchResponse?.data?.modifiedCount > 0) {
        Swal.fire("Rider approved!", "", "success");
        refetch();
        setModalOpen(false);
      }
    } else if (action === "rejected") {
      //  Reject: update status then delete
      patchResponse = await axiosSecure.patch(`/riders/${riderId}`, {
        status: "rejected",
      });

      if (patchResponse?.data?.modifiedCount > 0) {
        deleteResponse = await axiosSecure.delete(`/riders/${riderId}`);
        if (deleteResponse?.data?.deletedCount > 0) {
          Swal.fire("Rider rejected and deleted!", "", "success");
          refetch();
          setModalOpen(false);
        }
      }
    }
  } catch (error) {
    Swal.fire("Error", "Something went wrong!", "error");
  }
};


  if (isPending)
    return <p className="p-6 text-center text-lg">Loading pending riders...</p>;

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#03373D]">
        Pending Riders
      </h2>

      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-[#03373D] text-white text-base">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Region</th>
              <th>District</th>
              <th>Warehouse</th>
              <th>Contact</th>
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
                <td>{rider.bikeBrand}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-4 text-center text-[#03373D]">
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
              <ul className="space-y-1 text-sm md:text-base w-full">
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

            <div className="mt-6 flex justify-end gap-3 flex-wrap">
              <button
                className="btn btn-success"
                onClick={() => handleDecision(selectedRider._id, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDecision(selectedRider._id, "rejected")}
              >
                Reject
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setModalOpen(false)}
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
