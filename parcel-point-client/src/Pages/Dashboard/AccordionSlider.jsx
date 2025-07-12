import React, { useState } from "react";
import { motion } from "framer-motion";

const panels = [
  {
    title: "Classic",
    img: "https://btibd.com/wp-content/uploads/2024/12/home-slider-december-24-550973.webp",
    link: "/properties/classic/dhaka",
  },
  {
    title: "Luxury",
    img: "https://btibd.com/wp-content/uploads/2024/12/home-slider-550021.webp",
    link: "/properties/luxury/dhaka",
  },
  {
    title: "Wellness Communities",
    img: "https://btibd.com/wp-content/uploads/2024/12/home-slider-december-24-939062.webp",
    link: "/properties/wellness-communities/dhaka",
  },
  {
    title: "Commercial",
    img: "https://btibd.com/wp-content/uploads/2024/12/home-slider-december-24-627328.webp",
    link: "/properties/commercial/dhaka",
  },
];

const AccordionSlider = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="flex h-[600px] max-w-7xl mx-auto overflow-hidden rounded-xl shadow-2xl">
      {panels.map((panel, i) => (
        <motion.div
          key={i}
          className="relative overflow-hidden cursor-pointer transition-all duration-500"
          style={{
            flex: activeIndex === i ? 4 : 1,
          }}
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <a href={panel.link} target="_blank" rel="noopener noreferrer">
            <img
              src={panel.img}
              alt={panel.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-2xl font-bold">
              {panel.title}
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
};

export default AccordionSlider;
