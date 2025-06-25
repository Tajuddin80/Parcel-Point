import React from "react";
import ServiceCard from "./ServiceCard";
import { FiClock, FiGlobe, FiBox, FiTruck, FiBriefcase, FiRefreshCw } from "react-icons/fi";

const services = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: FiClock,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: FiGlobe,
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: FiBox,
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    icon: FiTruck,
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    icon: FiBriefcase,
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    icon: FiRefreshCw,
  },
];

const ServiceSection = () => {
  return (
    <section 
    // data-aos="fade-left"
     className="py-12 px-4 rounded-3xl md:px-8 my-5 lg:px-16 bg-[#03373D]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-6">
          Our Services
        </h1>
        <p className="text-center text-xl text-neutral-content mb-10">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
             service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
