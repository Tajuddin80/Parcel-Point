import { FaTruck, FaMoneyCheckAlt, FaSearch } from "react-icons/fa";

const Dashboard = () => {
  const parcels = [
    {
      id: "PCL-001",
      name: "Taj Uddin Certificate",
      type: "Document",
      status: "Pending",
      warehouse: "Cumilla",
      amount: 200,
    },
    {
      id: "PCL-002",
      name: "Electronics",
      type: "Box",
      status: "Shipped",
      warehouse: "Dhaka",
      amount: 500,
    },
    // Add more parcels as needed
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-2xl font-bold text-center text-primary">📦 My Parcels</div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 shadow rounded-xl">
          <div className="stat-figure text-primary">
            <FaTruck className="text-2xl" />
          </div>
          <div className="stat-title">Total Parcels</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat bg-base-200 shadow rounded-xl">
          <div className="stat-figure text-success">
            <FaMoneyCheckAlt className="text-2xl" />
          </div>
          <div className="stat-title">Paid</div>
          <div className="stat-value text-success">৳1000</div>
        </div>
        <div className="stat bg-base-200 shadow rounded-xl">
          <div className="stat-figure text-warning">
            <FaSearch className="text-2xl" />
          </div>
          <div className="stat-title">In Transit</div>
          <div className="stat-value text-warning">3</div>
        </div>
      </div>

      {/* Parcel Table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Warehouse</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel.id}>
                <td>{parcel.id}</td>
                <td>{parcel.name}</td>
                <td>{parcel.type}</td>
                <td>{parcel.warehouse}</td>
                <td>
                  <span
                    className={`badge ${
                      parcel.status === "Pending"
                        ? "badge-warning"
                        : parcel.status === "Shipped"
                        ? "badge-info"
                        : "badge-success"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td>৳{parcel.amount}</td>
                <td className="flex gap-2">
                  <button className="btn btn-xs btn-outline btn-primary">View</button>
                  <button className="btn btn-xs btn-outline btn-accent">Pay</button>
                  <button className="btn btn-xs btn-outline btn-secondary">Track</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
