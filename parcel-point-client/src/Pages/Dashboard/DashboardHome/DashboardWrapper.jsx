import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FaUsersCog,
  FaTruckLoading,
  FaMoneyCheckAlt,
  FaUserShield,
  FaClipboardList,
  FaMapMarkerAlt,
  FaBox,
} from "react-icons/fa";
import Typewriter from "typewriter-effect";
import useAuth from "../../../hooks/useAuth";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const DashboardWrapper = ({ title, quotes, cards }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full p-6 flex flex-col justify-center items-center space-y-12 bg-base-100">
      {/* Welcome Text */}
      <motion.div
        className="text-center space-y-2"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Welcome, {user?.displayName || "User"}! 👋
        </h1>
        <div className="text-xl md:text-2xl font-semibold text-secondary">
          <Typewriter
            options={{ strings: quotes, autoStart: true, loop: true }}
          />
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        className="rounded-xl text-center space-y-6 w-full max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.6 }}
      >
        <p className="text-lg text-base-content">
          Use the sidebar to navigate your dashboard. Stay updated, manage your
          tasks, and take control.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl w-full"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.9 }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.route)}
            className="bg-base-200 p-8 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
          >
            <card.icon className={`text-5xl ${card.color} mb-4 mx-auto`} />
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-base text-base-content">{card.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// USER Dashboard
export const UserDashboard = () => (
  <DashboardWrapper
    title="User Dashboard"
    quotes={[
      "Welcome back to Parcel Point!",
      "Track your deliveries with ease.",
      "Experience fast, secure shipping.",
    ]}
    cards={[
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
    ]}
  />
);

//  RIDER Dashboard
export const RiderDashboard = () => (
  <DashboardWrapper
    title="Rider Dashboard"
    quotes={[
      "Your delivery missions at a glance.",
      "Update pickups and mark deliveries.",
      "Ride with responsibility!",
    ]}
    cards={[
      {
        icon: FaTruckLoading,
        title: "Assigned Parcels",
        description: "View parcels assigned to you for delivery.",
        color: "text-primary",
        route: "/dashboard/pendingDeliveries",
      },
      {
        icon: FaMapMarkerAlt,
        title: "Pickup/Drop Zones",
        description: "Know your route and delivery regions.",
        color: "text-success",
        route: "/coverage",
      },
      {
        icon: FaClipboardList,
        title: "Update Status",
        description: "Update parcel status in real-time.",
        color: "text-accent",
        route: "/dashboard/completedDeliveries",
      },
    ]}
  />
);

//  ADMIN Dashboard
export const AdminDashboard = () => (
  <DashboardWrapper
    title="Admin Dashboard"
    quotes={[
      "Monitor operations across the platform.",
      "Manage users, riders, and parcels.",
      "Ensure efficiency and security.",
    ]}
    cards={[
      {
        icon: FaUsersCog,
        title: "User Management",
        description: "Control user roles and handle access.",
        color: "text-primary",
        route: "/dashboard/makeAdmin",
      },
      {
        icon: FaUserShield,
        title: "Rider Assignments",
        description: "Assign or update rider responsibilities.",
        color: "text-success",
        route: "/dashboard/assignRider",
      },
      {
        icon: FaMoneyCheckAlt,
        title: "Payments Overview",
        description: "Track and manage payments and transactions.",
        color: "text-warning",
        route: "/dashboard/paymentHistory",
      },
    ]}
  />
);
