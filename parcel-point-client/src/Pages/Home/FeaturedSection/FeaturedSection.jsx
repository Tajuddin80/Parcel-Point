import React from "react";
import img2 from "../../../assets/safe-delivery.png";
import img1 from "../../../assets/live-tracking.png";
import img3 from "../../../assets/safe-delivery.png";

const features = [
  {
    imgSrc: img2,
    alt: "100% Safe Delivery",
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    imgSrc: img1,
    alt: "Live Parcel Tracking",
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
  },

  {
    imgSrc: img3,
    alt: "24/7 Call Center Support",
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
  },
];

const FeaturedSection = () => {
  return (
    <div
      // data-aos="fade-left"
      className="my-10 px-4 md:px-8 lg:px-16 bg-base-100 space-y-6 overflow-x-hidden"
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row bg-white shadow-md rounded-box p-4 md:p-6 gap-4 md:gap-6 max-w-full"
        >
          {/* Image */}
          <div className="flex items-center space-x-4 md:space-x-6 max-w-full">
            <img
              src={feature.imgSrc}
              alt={feature.alt}
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain max-w-full"
            />
            {/* Vertical Line */}
            <div className="hidden md:block border-l border-dashed border-gray-400 h-24"></div>
          </div>

          {/* Text Content */}
          <div className="pt-4 md:pt-0 md:pl-4 max-w-full">
            <h3 className="text-xl font-bold text-[#03373D]">
              {feature.title}
            </h3>
            <p className="mt-2 text-black">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedSection;
