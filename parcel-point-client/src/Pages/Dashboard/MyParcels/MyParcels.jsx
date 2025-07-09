import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import {
  FaTruck,
  FaMoneyCheckAlt,
  FaMoneyBill,
  FaEye,
  FaTrash,
  FaWeightHanging,
} from "react-icons/fa";

const MyParcels = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user parcels
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
      enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return res.data;
    },
  });

  // Handlers
  const handleView = (parcel) => {
    console.log("View:", parcel);
    // Future: modal or detail page
  };

  const handlePay = (parcel) => {
    navigate(`/dashboard/payment/${parcel._id}`);
  };

  const handleDelete = (parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete parcel: ${parcel.parcelName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/parcels/${parcel._id}`)
          .then((res) => {
            if (res.data.deletedCount) {
              Swal.fire("Deleted!", "Parcel has been deleted.", "success");
              refetch();
            }
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete parcel.", "error");
          });
      }
    });
  };

  // Summary Counts
  const totalParcels = parcels.length;
  const paidParcels = parcels.filter((p) => p.paymentStatus === "paid").length;
  const unpaidParcels = totalParcels - paidParcels;

  return (
    <div className="p-2 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded shadow">
          <div className="stat-figure text-primary">
            <FaTruck className="text-3xl" />
          </div>
          <div className="stat-title">Total Parcels</div>
          <div className="stat-value">{totalParcels}</div>
        </div>
        <div className="stat bg-base-200 rounded shadow">
          <div className="stat-figure text-success">
            <FaMoneyCheckAlt className="text-3xl" />
          </div>
          <div className="stat-title">Paid</div>
          <div className="stat-value text-success">{paidParcels}</div>
        </div>
        <div className="stat bg-base-200 rounded shadow">
          <div className="stat-figure text-error">
            <FaMoneyBill className="text-3xl" />
          </div>
          <div className="stat-title">Unpaid</div>
          <div className="stat-value text-error">{unpaidParcels}</div>
        </div>
      </div>

      {/* Parcel Table */}
      <div className="overflow-x-auto text-xs md:text-sm">
        <table className="table table-zebra w-full text-sm md:text-base">
          <thead className="font-semibold text-xs text-white bg-[#03373D]">
            <tr className="h-14">
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Weight (kg)</th>
              <th>Tracking ID</th>
              <th>Payment</th>
              <th>Cost (৳)</th>
              <th>Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id} className="h-16 md:h-20 text-xs md:text-sm">
                <td>{index + 1}</td>
                <td className="whitespace-nowrap max-w-[100px] md:max-w-none truncate">
                  {parcel.parcelName}
                </td>
                <td>{parcel.parcelType}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <FaWeightHanging /> {parcel.parcelWeight}
                  </div>
                </td>
                <td>
                  <div
                    className="tooltip cursor-pointer"
                    data-tip="Click to copy"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(parcel.trackingId)
                        .then(() => {
                          Swal.fire({
                            title: "Copied!",
                            text: `Tracking ID "${parcel.trackingId}" copied to clipboard.`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                          });
                        });
                    }}
                  >
                    <span className="badge badge-outline text-[10px] md:text-sm max-w-[100px] truncate inline-block">
                      {parcel.trackingId}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge px-3 py-1 text-xs md:text-sm ${
                      parcel.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td>৳{parcel.totalCost}</td>
                <td className="whitespace-nowrap">
                  {new Date(parcel.createdAt).toLocaleString()}
                </td>
                <td>
                  <div className="flex flex-wrap gap-1 md:gap-2 justify-start">
                    <button
                      className="btn btn-xs md:btn-sm btn-outline btn-info"
                      onClick={() => handleView(parcel)}
                    >
                      <FaEye className="mr-1" /> View
                    </button>

                    <button
                      className="btn btn-xs md:btn-sm btn-outline btn-success"
                      onClick={() => handlePay(parcel)}
                      disabled={parcel.paymentStatus === "paid"}
                    >
                      <FaMoneyBill className="mr-1" />
                      {parcel.paymentStatus === "paid" ? "Paid" : "Pay"}
                    </button>

                    <button
                      className="btn btn-xs md:btn-sm btn-outline btn-warning"
                      onClick={() =>
                        navigate(
                          `/dashboard/trackParcel?track=${parcel.trackingId}`
                        )
                      }
                    >
                      <FaTruck className="mr-1" /> Track
                    </button>

                    <button
                      className="btn btn-xs md:btn-sm btn-outline btn-error"
                      onClick={() => handleDelete(parcel)}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {parcels.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center text-gray-400 py-8">
                  You don’t have any parcels yet. <br />
                  <Link to={"/sendParcel"} className="btn btn-primary mt-10">
                    Send a Parcel
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
