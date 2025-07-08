// import React from "react";
// import useAuth from "../../../hooks/useAuth";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router";

// const MyParcels = () => {
//   const axiosSecure = useAxiosSecure();
//   const { user } = useAuth();

// const navigate = useNavigate()
// // use tanstack query
//   const { data: parcels = [], refetch } = useQuery({
//     queryKey: ["my-parcels", user?.email],
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
//       return res.data;
//     },
//   });

//   const handleView = (parcel) => {
//     console.log("View details for:", parcel);
//     // You can navigate or open modal
//   };

//   const handlePay = (parcel) => {

//     navigate(`/dashboard/payment/${parcel._id}`)

//     // console.log("Pay for:", parcel);
//     // Payment logic
//   };

//   const handleDelete = (parcel) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: `Delete parcel: ${parcel.parcelName}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axiosSecure
//           .delete(`/parcels/${parcel._id}`)
//           .then((res) => {
//             if (res.data.deletedCount) {
//               Swal.fire({
//                 title: "Deleted!",
//                 text: "The parcel has been deleted.",
//                 icon: "success",
//                 timer: 1500,
//                 showConfirmButton: false,
//               });
//             }
//             refetch()
//           })
//           .catch(() => {
//             Swal.fire("Error!", "Failed to delete the parcel.", "error");
//           });
//       }
//     });
//   };
//   return (
//     <>
//       <div className="overflow-x-auto rounded-lg shadow">
//         <table className="table table-zebra">
//           <thead className="bg-base-200">
//             <tr>
//               <th>#</th>
//               <th>Title</th>
//               <th>Type</th>
//               <th>Created At</th>
//               <th>Cost (৳)</th>
//               <th>Payment</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parcels.map((parcel, index) => (
//               <tr key={parcel._id}>
//                 <th>{index + 1}</th>
//                 <td>{parcel.parcelName}</td>
//                 <td>
//                   {parcel.parcelType === "Document"
//                     ? "Document"
//                     : "Non-Document"}
//                 </td>
//                 <td>{new Date(parcel.createdAt).toLocaleString()}</td>
//                 <td>{parcel.totalCost}</td>
//                 <td>
//                   <span
//                     className={`badge ${
//                       parcel.paymentStatus === "paid"
//                         ? "badge-success"
//                         : "badge-error"
//                     }`}
//                   >
//                     {parcel.paymentStatus === "paid" ? "Paid" : "Unpaid"}
//                   </span>
//                 </td>
//                 <td className="flex flex-wrap gap-2">
//                   <button
//                     className="btn btn-sm btn-info"
//                     onClick={() => handleView(parcel)}
//                   >
//                     View
//                   </button>
//                   {parcel.paymentStatus !== "paid" && (
//                     <button
//                       className="btn btn-sm btn-success"
//                       onClick={() => handlePay(parcel)}
//                     >
//                       Pay
//                     </button>
//                   )}
//                   <button
//                     className="btn btn-sm btn-error"
//                     onClick={() => handleDelete(parcel)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default MyParcels;
// import React from "react";
// import {
//   FaTruck,
//   FaMoneyCheckAlt,
//   FaSearch,
//   FaEye,
//   FaMoneyBill,
//   FaTrashAlt,
// } from "react-icons/fa";

// const MyParcels = () => {
//   const parcels = [
//     {
//       id: "PCL-001",
//       name: "Taj Uddin Certificate",
//       type: "Document",
//       status: "Pending",
//       warehouse: "Cumilla",
//       amount: 200,
//     },
//     {
//       id: "PCL-002",
//       name: "Electronics",
//       type: "Box",
//       status: "Shipped",
//       warehouse: "Dhaka",
//       amount: 500,
//     },
//     {
//       id: "PCL-003",
//       name: "Clothing",
//       type: "Box",
//       status: "In Transit",
//       warehouse: "Rajshahi",
//       amount: 300,
//     },
//   ];

//   return (
//     <div className="p-6 space-y-8">
//       <h2 className="text-2xl font-bold text-center text-primary">
//         📦 My Parcels
//       </h2>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="stat bg-base-200 shadow rounded-xl">
//           <div className="stat-figure text-primary">
//             <FaTruck className="text-3xl" />
//           </div>
//           <div className="stat-title">Total Parcels</div>
//           <div className="stat-value">{parcels.length}</div>
//         </div>
//         <div className="stat bg-base-200 shadow rounded-xl">
//           <div className="stat-figure text-success">
//             <FaMoneyCheckAlt className="text-3xl" />
//           </div>
//           <div className="stat-title">Paid</div>
//           <div className="stat-value text-success">৳1000</div>
//         </div>
//         <div className="stat bg-base-200 shadow rounded-xl">
//           <div className="stat-figure text-warning">
//             <FaSearch className="text-3xl" />
//           </div>
//           <div className="stat-title">In Transit</div>
//           <div className="stat-value text-warning">
//             {
//               parcels.filter((p) => p.status.toLowerCase() === "in transit")
//                 .length
//             }
//           </div>
//         </div>
//       </div>

//       {/* Parcel Table */}
//       <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
//         <table className="table table-zebra w-full">
//           <thead className="bg-base-200 text-base font-semibold">
//             <tr>
//               <th>#</th>
//               <th>Parcel Name</th>
//               <th>Type</th>
//               <th>Warehouse</th>
//               <th>Status</th>
//               <th>Amount (৳)</th>
//               <th className="text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parcels.map((parcel, index) => (
//               <tr key={parcel.id}>
//                 <td>{index + 1}</td>
//                 <td>{parcel.name}</td>
//                 <td>{parcel.type}</td>
//                 <td>{parcel.warehouse}</td>
//                 <td>
//                   <span
//                     className={`badge ${
//                       parcel.status === "Pending"
//                         ? "badge-warning"
//                         : parcel.status === "Shipped"
//                         ? "badge-info"
//                         : parcel.status === "In Transit"
//                         ? "badge-accent"
//                         : "badge-success"
//                     }`}
//                   >
//                     {parcel.status}
//                   </span>
//                 </td>
//                 <td>৳{parcel.amount}</td>
//                 <td>
//                   <div className="flex flex-wrap justify-center gap-2">
//                     {/* View */}
//                     <button
//                       className="btn btn-xs btn-outline btn-info hover:scale-105 transition"
//                       title="View"
//                     >
//                       <FaEye className="mr-1" /> View
//                     </button>
//                     {/* Pay */}
//                     <button
//                       className="btn btn-xs btn-outline btn-success hover:scale-105 transition"
//                       title="Pay"
//                     >
//                       <FaMoneyBill className="mr-1" /> Pay
//                     </button>
//                     {/* Track */}
//                     <button
//                       className="btn btn-xs btn-outline btn-warning hover:scale-105 transition"
//                       title="Track"
//                     >
//                       <FaSearch className="mr-1" /> Track
//                     </button>
//                     {/* Delete */}
//                     <button
//                       className="btn btn-xs btn-outline btn-error hover:scale-105 transition"
//                       title="Delete"
//                     >
//                       <FaTrashAlt className="mr-1" /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {parcels.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center text-gray-400 py-6">
//                   No parcels found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MyParcels;

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
  FaBarcode,
  FaWeightHanging,
} from "react-icons/fa";

const MyParcels = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user parcels
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
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
      <div className="overflow-x-auto rounded-lg shadow bg-base-100">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-sm font-semibold">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Weight (kg)</th>
              <th>Tracking ID</th>
              {/* <th>Warehouse</th> */}
              <th>Payment</th>
              {/* <th>Status</th> */}
              <th>Cost (৳)</th>
              <th>Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.parcelName}</td>
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
                    <span className="badge badge-outline text-xs flex items-center gap-1">
                      {parcel.trackingId}
                    </span>
                  </div>
                </td>
                {/* <td>{parcel.senderWarehouse}</td> */}
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
                {/* <td>
                  <span
                    className={`badge ${
                      parcel.deliveryStatus === "not_collected"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {parcel.deliveryStatus.replace("_", " ")}
                  </span>
                </td> */}
                <td>৳{parcel.totalCost}</td>
                <td>{new Date(parcel.createdAt).toLocaleString()}</td>
                <td>
                  <div className="flex flex-wrap gap-2 justify-start">
                    <button
                      className="btn btn-xs btn-outline btn-info"
                      onClick={() => handleView(parcel)}
                    >
                      <FaEye className="mr-1" /> View
                    </button>

                    {parcel.paymentStatus !== "paid" && (
                      <button
                        className="btn btn-xs btn-outline btn-success"
                        onClick={() => handlePay(parcel)}
                      >
                        <FaMoneyBill className="mr-1" /> Pay
                      </button>
                    )}

                    <button
                      className="btn btn-xs btn-outline btn-warning"
                      onClick={() =>
                        navigate(
                          `/dashboard/trackParcel?track=${parcel.trackingId}`
                        )
                      }
                    >
                      <FaTruck className="mr-1" /> Track
                    </button>

                    <button
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() => handleDelete(parcel)}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <>
                <tr>
                  <td colSpan="11" className="text-center text-gray-400 py-8">
                    You don’t have any parcels yet. <br />  <Link to={'/sendParcel'} className="btn btn-primary mt-10">Send a Parcel</Link>
                  </td>
                </tr>
            
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
