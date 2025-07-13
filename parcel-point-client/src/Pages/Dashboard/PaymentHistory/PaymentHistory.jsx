import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../shared/Loader/Loader";
import { Helmet } from "react-helmet";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
      enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`);
      return res.data;
    },
  });
  if (isPending) {
    return <Loader></Loader>;
  }
  return (
    <><Helmet>
        <title>Parcel Point | Payment History</title>
      </Helmet>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 mt-6">
        <table className="table table-zebra w-full text-sm md:text-base">
          <thead className="text-white bg-[#03373D] text-xs md:text-sm uppercase">
            <tr className="h-14">
              <th>#</th>
              <th>Parcel Name</th>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Amount (৳)</th>
              <th>Method</th>
              <th>Card Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id} className="h-16 md:h-20">
                <td>{index + 1}</td>
                <td className="font-mono text-xs md:text-sm">
                  {payment.parcelName || ""}
                </td>
                <td className="font-mono text-xs md:text-sm">
                  {payment.transactionId}
                </td>
                <td>{payment.userName}</td>
                <td className="whitespace-nowrap">{payment.email}</td>
                <td className="font-semibold text-green-700">
                  ৳{payment.amount}
                </td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.cardType}</td>
                <td className="whitespace-nowrap">
                  {new Date(payment.paid_at).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-base">
            No payment history found.
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentHistory;
