import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaCopy, FaUserAlt, FaTruck } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import Swal from "sweetalert2";

const ParcelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcel,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["parcel-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcelData/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: text,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        timerProgressBar: true,
      });
    });
  };

  if (isPending || isFetching) return <Loader />;

  if (!parcel)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        Parcel not found.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white p-10 shadow-xl rounded-2xl my-12">
      <button
        onClick={() => navigate('/dashboard/myParcels')}
        className="mb-8 text-black btn font-semibold flex items-center gap-2 hover:underline text-lg"
      >
        <FaArrowLeft /> Back
      </button>

      <h2 className="text-4xl font-bold text-black mb-10 text-center">
        Parcel Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg">
        <div>
          <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-black">
            <FaUserAlt /> Sender Info
          </h3>
          <p>
            <strong>Name:</strong> {parcel.senderName}
          </p>
          <p>
            <strong>Region:</strong> {parcel.senderRegion}
          </p>
          <p>
            <strong>Warehouse:</strong> {parcel.senderWarehouse}
          </p>
          <p>
            <strong>Address:</strong> {parcel.senderAddress}
          </p>
          <p className="flex items-center gap-2">
            <strong>Contact:</strong> {parcel.senderContact}
            <FaCopy
              className="cursor-pointer "
              onClick={() => handleCopy(parcel.senderContact)}
            />
          </p>
          <p>
            <strong>Pickup Instruction:</strong> {parcel.pickupInstruction}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-black">
            <FaUserAlt /> Receiver Info
          </h3>
          <p>
            <strong>Name:</strong> {parcel.receiverName}
          </p>
          <p>
            <strong>Region:</strong> {parcel.receiverRegion}
          </p>
          <p>
            <strong>Warehouse:</strong> {parcel.receiverWarehouse}
          </p>
          <p>
            <strong>Address:</strong> {parcel.receiverAddress}
          </p>
          <p className="flex items-center gap-2">
            <strong>Contact:</strong> {parcel.receiverContact}
            <FaCopy
              className="cursor-pointer "
              onClick={() => handleCopy(parcel.receiverContact)}
            />
          </p>
          <p>
            <strong>Delivery Instruction:</strong> {parcel.deliveryInstruction}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-black">
            <FaTruck /> Parcel Info
          </h3>
          <p>
            <strong>Type:</strong> {parcel.parcelType}
          </p>
          <p>
            <strong>Name:</strong> {parcel.parcelName}
          </p>
          <p>
            <strong>Weight:</strong> {parcel.parcelWeight} kg
          </p>
          <p className="flex items-center gap-2">
            <strong>Tracking ID:</strong> {parcel.trackingId}
            <FaCopy
              className="cursor-pointer "
              onClick={() => handleCopy(parcel.trackingId)}
            />
          </p>
          <p>
            <strong>Status:</strong> {parcel.deliveryStatus}
          </p>
          <p>
            <strong>Payment:</strong> {parcel.paymentStatus}
          </p>
          <p>
            <strong>Cost:</strong> ৳{parcel.totalCost}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-black">
            <FaUserAlt /> Assigned Rider
          </h3>
          <p>
            <strong>Email:</strong> {parcel.assignedRiderEmail || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <strong>Contact:</strong> {parcel.assignedRiderContact || "N/A"}
            {parcel.assignedRiderContact && (
              <FaCopy
                className="cursor-pointer"
                onClick={() => handleCopy(parcel.assignedRiderContact)}
              />
            )}
          </p>
          <p>
            <strong>NID:</strong> {parcel.assignedRiderNid || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-10 text-base text-gray-600">
        <p>
          <strong>Created At:</strong> {new Date(parcel.createdAt).toLocaleString()}
        </p>
        {parcel.pickedAt && (
          <p>
            <strong>Picked At:</strong> {new Date(parcel.pickedAt).toLocaleString()}
          </p>
        )}
        {parcel.deliveredAt && (
          <p>
            <strong>Delivered At:</strong> {new Date(parcel.deliveredAt).toLocaleString()}
          </p>
        )}
        <p>
          <strong>Created By:</strong> {parcel.created_by}
        </p>
      </div>
    </div>
  );
};

export default ParcelDetails;
