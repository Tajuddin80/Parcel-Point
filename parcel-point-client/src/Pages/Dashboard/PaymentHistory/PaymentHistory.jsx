import React from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import Loader from '../../shared/Loader/Loader'

const PaymentHistory = () => {
    const {user}= useAuth()
const axiosSecure = useAxiosSecure()
const {isPending, data: payments =[]}= useQuery({
    queryKey: ['payments', user?.email],
    queryFn: async()=>{
        const res = await axiosSecure.get(`/payments?email=${user?.email}`)
        return res.data
    }
})
if (isPending) {
    return <Loader></Loader>
}
  return (
   <>
     <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 mt-6">
      <table className="table table-zebra w-full text-sm">
        <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
          <tr>
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
            <tr key={payment._id}>
              <td>{index + 1}</td>
              <td className="font-mono text-xs">{payment.parcelName || ''}</td>
              <td className="font-mono text-xs">{payment.transactionId}</td>
              <td>{payment.userName}</td>
              <td>{payment.email}</td>
              <td>৳{payment.amount}</td>
              <td>{payment.paymentMethod}</td>
              <td>{payment.cardType}</td>
              <td>
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
        <div className="p-4 text-center text-gray-500">No payment history found.</div>
      )}
    </div>
   </>
  )
}

export default PaymentHistory