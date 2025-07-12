import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";
import useAuth from "../../../hooks/useAuth";

const COLORS = ["#00C49F", "#FF8042", "#0088FE"];

const RiderDashboard = () => {

    const {user} = useAuth()
  const axiosSecure = useAxiosSecure();

   const { data = {}, isLoading } = useQuery({
    queryKey: ["riderDashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/dashboard?email=${user.email}`); // ✅ No query param needed
      return res.data;
    },
    enabled: !!user?.email, // ✅ ensures user is ready before query runs
  });

  const parcelData = [
    { name: "Assigned", value: data.assignedParcels || 0 },
    { name: "Delivered", value: data.deliveredParcels || 0 },
  ];

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold"> Rider Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-base-100 rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Parcel Summary</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={parcelData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {parcelData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-base-100 rounded-xl shadow p-6 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Earnings</h3>
          <p className="text-4xl font-bold text-green-600">
            ৳ {data.totalEarnings || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
