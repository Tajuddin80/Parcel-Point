import React from "react";
import Typewriter from "typewriter-effect";
import { FaBoxOpen, FaMapMarkedAlt, FaSmile } from "react-icons/fa";
import { motion } from "framer-motion";
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
