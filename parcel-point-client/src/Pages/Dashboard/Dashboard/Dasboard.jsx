import React from "react";
import Typewriter from "typewriter-effect";
import { FaBoxOpen, FaMapMarkedAlt, FaSmile } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full p-6 flex flex-col justify-center items-center space-y-12 bg-base-100">
      {/* Welcome Message */}
      <motion.div
        className="text-center space-y-2"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Welcome, {user?.displayName}! 👋
        </h1>
        <div className="text-xl md:text-2xl font-semibold text-secondary">
          <Typewriter
            options={{
              strings: [
                "Glad to see you back at Parcel Point!",
                "Your Reliable Parcel Delivery Platform.",
                "Fast. Secure. Nationwide Delivery.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </motion.div>

      {/* User Info Card */}
      <motion.div
        className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-3xl shadow-xl w-full max-w-xl text-center space-y-6 border border-base-300"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.3 }}
      >
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={user?.photoURL}
            alt="User Profile"
            className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-base-content">{user?.displayName}</h2>
          <p className="text-base text-base-content mt-1">📧 {user?.email}</p>
          <div className="mt-3">
            <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm shadow">
              Role: {user?.role || "Customer"}
            </span>
          </div>
        </div>

        <div>
          <Link
            to="/update-profile"
            className="inline-block mt-4 px-5 py-2 text-sm font-medium text-white bg-secondary rounded-full hover:bg-secondary-focus transition duration-200"
          >
            Update Profile
          </Link>
        </div>
      </motion.div>

      {/* Overview Text */}
      <motion.div
        className="rounded-xl text-center space-y-6 w-full max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.6 }}
      >
        <p className="text-lg text-base-content">
          This dashboard gives you a quick glance at your parcel delivery activity.
          From here, you can check your parcel summaries, manage payments, and
          stay updated with delivery statuses — all in one place.
        </p>
        <p className="text-lg text-base-content">
          Use the sidebar or menu to move to other sections like "My Parcels", "Payments",
          or "Tracking" to explore further.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl w-full"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.9 }}
      >
        <div className="bg-base-200 p-8 rounded-xl shadow hover:shadow-lg transition duration-300">
          <FaBoxOpen className="text-5xl text-primary mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Manage Your Parcels</h3>
          <p className="text-base text-base-content">
            View all your parcel bookings, delivery status, and history.
          </p>
        </div>
        <div className="bg-base-200 p-8 rounded-xl shadow hover:shadow-lg transition duration-300">
          <FaMapMarkedAlt className="text-5xl text-success mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Track Deliveries</h3>
          <p className="text-base text-base-content">
            Get real-time updates on your parcel’s journey across Bangladesh.
          </p>
        </div>
        <div className="bg-base-200 p-8 rounded-xl shadow hover:shadow-lg transition duration-300">
          <FaSmile className="text-5xl text-warning mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-2">Enjoy Seamless Service</h3>
          <p className="text-base text-base-content">
            Designed to give you a fast, easy, and satisfying delivery experience.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
