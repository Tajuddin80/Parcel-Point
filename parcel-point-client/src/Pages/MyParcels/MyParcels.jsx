import React from "react";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyParcels = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();


// use tanstack query 
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return res.data;
    },
  });



  const handleView = (parcel) => {
    console.log("View details for:", parcel);
    // You can navigate or open modal
  };

  const handlePay = (parcel) => {
    console.log("Pay for:", parcel);
    // Payment logic
  };

  const handleDelete = (parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete parcel: ${parcel.parcelName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/parcels/${parcel._id}`)
          .then((res) => {
            if (res.data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "The parcel has been deleted.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            }
            refetch()
          })
          .catch(() => {
            Swal.fire("Error!", "Failed to delete the parcel.", "error");
          });
      }
    });
  };
  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Cost (৳)</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td>{parcel.parcelName}</td>
                <td>
                  {parcel.parcelType === "Document"
                    ? "Document"
                    : "Non-Document"}
                </td>
                <td>{new Date(parcel.createdAt).toLocaleString()}</td>
                <td>{parcel.totalCost}</td>
                <td>
                  <span
                    className={`badge ${
                      parcel.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="flex flex-wrap gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleView(parcel)}
                  >
                    View
                  </button>
                  {parcel.paymentStatus !== "paid" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handlePay(parcel)}
                    >
                      Pay
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(parcel)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyParcels;
