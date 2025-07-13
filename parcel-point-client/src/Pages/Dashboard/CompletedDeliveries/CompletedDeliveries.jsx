import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaMoneyBillWave, FaWallet } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import { Helmet } from "react-helmet";

const CompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [cashoutAmount, setCashoutAmount] = useState(0);

  const { data: parcels = [], isLoading: isParcelLoading } = useQuery({
    queryKey: ["rider-completed-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/rider-completed-parcels", {
        params: { email: user.email },
      });
      return res.data;
    },
  });

  const {
    data: walletInfo = {},
    isLoading: isWalletLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ["rider-wallet", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/wallet", {
        params: { email: user.email },
      });
      return res.data;
    },
  });

  const { mutate: cashout, isPending: isCashoutProcessing } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/rider/cashout", {
        email: user.email,
        amount: cashoutAmount,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Cashout successful!", "success");
      refetchWallet();
      setCashoutAmount(0);
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Cashout failed.",
        "error"
      );
    },
  });

  const calculateEarning = (parcel) => {
    const total = parseFloat(parcel.totalCost || 0);
    const isSameDistrict = parcel.senderDistrict === parcel.receiverDistrict;
    return isSameDistrict ? total * 0.8 : total * 0.3;
  };

  if (isParcelLoading || isWalletLoading) return <Loader />;

  return (
    <div className="">
       <Helmet>
        <title>Parcel Point | Completed Deliveries</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        Completed Deliveries
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
        <div className=" rounded-xl p-4 shadow-md">
          <FaWallet className="text-3xl text-green-600 mx-auto mb-2" />
          <p className="text-xl font-semibold">Total Earned</p>
          <p className="text-2xl font-bold text-green-700">
            ৳{walletInfo.totalEarned?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className=" rounded-xl p-4 shadow-md">
          <FaMoneyBillWave className="text-3xl text-yellow-600 mx-auto mb-2" />
          <p className="text-xl font-semibold">Available</p>
          <p className="text-2xl font-bold text-yellow-700">
            ৳{walletInfo.amountAvailable?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className=" rounded-xl p-4 shadow-md">
          <FaMoneyBillWave className="text-3xl text-red-600 mx-auto mb-2" />
          <p className="text-xl font-semibold">Withdrawn</p>
          <p className="text-2xl font-bold text-red-700">
            ৳{walletInfo.amountWithdrawn?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="number"
          min="0"
          max={walletInfo.amountAvailable || 0}
          value={cashoutAmount}
          onChange={(e) => setCashoutAmount(parseFloat(e.target.value))}
          className="input input-bordered w-full md:w-60 text-lg"
          placeholder="Cashout Amount"
        />
        <button
          onClick={() => {
            if (cashoutAmount > (walletInfo.amountAvailable || 0)) {
              return Swal.fire(
                "Invalid",
                "You can't withdraw more than available.",
                "warning"
              );
            }
            if (cashoutAmount <= 0) {
              return Swal.fire("Invalid", "Enter a valid amount.", "warning");
            }
            cashout();
          }}
          className="btn btn-success text-white w-full md:w-auto text-lg"
          disabled={isCashoutProcessing}
        >
          {isCashoutProcessing ? "Processing..." : "Cashout"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl  shadow-md">
        <table className="table w-full  ">
          <thead className="bg-base-200 text-base text-gray-800">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Status</th>
              <th>Picked At</th>
              <th>Delivered At</th>
              <th>Parcel Cost</th>
              <th>Rider Earned</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td className="font-medium">{index + 1}</td>
                <td>{parcel.trackingId}</td>
                <td>
                  <span className="font-semibold">{parcel.senderName}</span>
                  <br />
                  <small className="text-gray-500">
                    {parcel.senderDistrict}
                  </small>
                </td>
                <td>
                  <span className="font-semibold">{parcel.receiverName}</span>
                  <br />
                  <small className="text-gray-500">
                    {parcel.receiverDistrict}
                  </small>
                </td>
                <td className="capitalize text-sm">
                  {parcel.deliveryStatus.replace("_", " ")}
                </td>
                <td className="text-sm">
                  {parcel.pickedAt
                    ? new Date(parcel.pickedAt).toLocaleString()
                    : "—"}
                </td>
                <td className="text-sm">
                  {parcel.deliveredAt
                    ? new Date(parcel.deliveredAt).toLocaleString()
                    : "—"}
                </td>
                <td className="text-lg font-medium text-blue-600">
                  ৳{parseFloat(parcel.totalCost || 0).toFixed(2)}
                </td>
                <td className="text-lg font-bold text-green-600">
                  ৳{calculateEarning(parcel).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedDeliveries;
