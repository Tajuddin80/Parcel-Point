import React from "react";
import { useNavigate } from "react-router";
import { FaBox, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      icon: FaBox,
      title: "My Parcels",
      description: "View all your parcel bookings and delivery history.",
      color: "text-primary",
      route: "/dashboard/myParcels",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Track Parcels",
      description: "Get real-time updates on your deliveries.",
      color: "text-success",
      route: "/dashboard/trackParcel",
    },
    {
      icon: FaMoneyCheckAlt,
      title: "Payments",
      description: "View your payment history and receipts.",
      color: "text-warning",
      route: "/dashboard/paymentHistory",
    },
  ];

  return (
    <div className="flex flex-col text-center justify-center items-center mx-auto min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {user?.displayName || "User"}! 👋
      </h1>

      <p className="mb-10 text-lg max-w-xl">
        Use the sidebar to navigate your dashboard. Stay updated, manage your
        tasks, and take control.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full ">
        {cards.map(({ icon: Icon, title, description, color, route }, idx) => (
          <div
            key={idx}
            onClick={() => navigate(route)}
            className="cursor-pointer bg-base-200 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <Icon className={`text-5xl ${color} mb-4`} />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
