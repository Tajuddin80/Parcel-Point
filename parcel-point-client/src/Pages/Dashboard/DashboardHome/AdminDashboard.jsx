import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../shared/Loader/Loader";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#AA336A"];

const Card = ({ children, className = "" }) => (
  <div className={`card bg-base-100 shadow-md rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold mb-3">{children}</h2>
);

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch /admin/analytics data
  const {
    data: analytics = {},
    isLoading: loadingAnalytics,
    error: errorAnalytics,
  } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics");
      return res.data;
    },
  });

  // Fetch /dashboard/delivery-stats data
  const {
    data: deliveryStats = {},
    isLoading: loadingStats,
    error: errorStats,
  } = useQuery({
    queryKey: ["deliveryStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/delivery-stats");
      return res.data;
    },
  });

  if (loadingAnalytics || loadingStats) return <Loader />;
  if (errorAnalytics || errorStats)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load data.</p>
    );

  const deliveryData = [
    { name: "Today", value: analytics.deliveries?.today || 0 },
    { name: "Week", value: analytics.deliveries?.week || 0 },
    { name: "Month", value: analytics.deliveries?.month || 0 },
    { name: "Year", value: analytics.deliveries?.year || 0 },
  ];

  const earningsData = [
    { name: "Admin Share", value: analytics.revenue?.adminShare || 0 },
    { name: "Rider Share", value: analytics.revenue?.riderShare || 0 },
  ];

  const riderStatusData = Object.entries(analytics.riders || {}).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Total Revenue */}
      <Card className="md:col-span-3">
        <CardTitle>Total Revenue</CardTitle>
        <p className="text-lg font-medium mb-4">
          Total Collected: ৳
          {analytics.revenue?.totalRevenue?.toFixed(2) || "0.00"}
        </p>
        <PieChart width={300} height={250}>
          <Pie
            data={earningsData}
            cx="50%"
            cy="50%"
            label
            outerRadius={80}
            dataKey="value"
          >
            {earningsData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `৳${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </Card>

      {/* Delivery Stats */}
      <Card>
        <CardTitle>Delivery Stats</CardTitle>
        <PieChart width={300} height={250}>
          <Pie
            data={deliveryData}
            cx="50%"
            cy="50%"
            label
            outerRadius={80}
            dataKey="value"
          >
            {deliveryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Card>

      {/* Rider Status */}
      <Card>
        <CardTitle>Rider Status</CardTitle>
        <PieChart width={300} height={250}>
          <Pie
            data={riderStatusData}
            cx="50%"
            cy="50%"
            label
            outerRadius={80}
            dataKey="value"
          >
            {riderStatusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Card>

      {/* Pending Requests */}
      <Card>
        <CardTitle>Pending Requests</CardTitle>
        <p>Role Change Requests: {analytics.pendingRoleRequests || 0}</p>
        <p>Pending Riders: {analytics.riders?.pending || 0}</p>
      </Card>
    </div>
  );
};

export default AdminDashboard;
