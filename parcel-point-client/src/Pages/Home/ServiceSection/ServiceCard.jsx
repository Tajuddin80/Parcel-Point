import React from "react";
import { FiPackage } from "react-icons/fi";
import { motion } from "framer-motion";

const ServiceCard = ({ service }) => {
  const { title, description, icon: Icon } = service;

  return (
    <motion.div
      className="card hover:bg-[#CAEB66] cursor-pointer bg-base-100 shadow-md hover:shadow-xl transition duration-300 ease-in-out"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="card-body flex flex-col items-center text-center">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center justify-center text-4xl md:text-5xl" style={{ color: "#03373D" }}>
            {Icon ? <Icon /> : <FiPackage />}
          </div>
        </motion.div>

        <motion.h2
          className="card-title text-lg md:text-xl"
          style={{ color: "#03373D" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
