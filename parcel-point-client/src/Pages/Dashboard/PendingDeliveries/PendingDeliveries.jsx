
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import useTrackingLogger from "../../../hooks/useTrackingLogger";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
const { logTracking } = useTrackingLogger();
  const {
    data: parcels = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["riderPendingParcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider-parcels?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleUpdateStatus = async (parcelId, currentStatus, trackingId) => {
    let nextStatus;
    if (currentStatus === "rider_assigned") {
      nextStatus = "in_transit";
    } else if (currentStatus === "in_transit") {
      nextStatus = "delivered";
    } else {
      return;
    }

    const confirmResult = await Swal.fire({
      title: `Confirm ${nextStatus.replace("_", " ")}?`,
      text: `Do you want to mark this parcel as ${nextStatus.replace("_", " ")}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, update`,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/rider-parcels/${parcelId}/status`, {
        deliveryStatus: nextStatus,
      });

      if (res.data.modifiedCount > 0) {
//  Log tracking status
     await logTracking({
        tracking_id: trackingId,
        status: nextStatus,
        details: `Status changed to ${nextStatus} by rider.`,
        updated_by: `Email: ${user.email}`,
      });
        Swal.fire("Success", `Parcel marked as ${nextStatus}`, "success");
        refetch();
      } else {
        Swal.fire("Info", "No change was made.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  if (isPending) return <Loader />;

  return (
    <div className="">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#03373D]">
        Pending Deliveries
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">No pending deliveries.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border">
          <table className="table table-zebra w-full text-sm md:text-base">
            <thead className="bg-[#03373D] text-white">
              <tr>
                <th>#</th>
                <th>Tracking ID</th>
                <th>Receiver</th>
                <th>Receiver Contact</th>
                <th>Receiver Address</th>
                <th>Parcel</th>
                <th>Weight</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.trackingId}</td>
                  <td>{parcel.receiverName}</td>
                  <td>{parcel.receiverContact}</td>
                  <td>{parcel.receiverAddress}</td>
                  <td>{parcel.parcelName}</td>
                  <td>{parcel.parcelWeight} kg</td>
                  <td>
                    <span className="badge badge-info text-white">
                      {parcel.deliveryStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    {parcel.deliveryStatus === "rider_assigned" && (
                      <button
                        className="btn btn-xs md:btn-sm btn-warning"
                        onClick={() =>
                          handleUpdateStatus(parcel._id, "rider_assigned", parcel.trackingId)
                        }
                      >
                        Mark as Picked
                      </button>
                    )}
                    {parcel.deliveryStatus === "in_transit" && (
                      <button
                        className="btn btn-xs md:btn-sm btn-success"
                        onClick={() =>
                          handleUpdateStatus(parcel._id, "in_transit", parcel.trackingId)
                        }
                      >
                        Mark as Delivered
                      </button>
                    )}
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

export default PendingDeliveries;
