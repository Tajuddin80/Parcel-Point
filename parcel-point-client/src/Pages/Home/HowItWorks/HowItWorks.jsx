import { FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Booking Pick & Drop',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    title: 'Cash On Delivery',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    title: 'Delivery Hub',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    title: 'Booking SME & Corporate',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export default function HowItWorks() {
  return (
    <section 
      // data-aos="fade-right" 
      className="px-4 py-12 mx-auto overflow-x-hidden"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[#03373D] mb-10 text-center">
        How it Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="rounded-3xl bg-white p-6 shadow-md transition hover:bg-[#CAEB66] group cursor-pointer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            custom={index}
          >
            <FiTruck
              size={36}
              className="text-[#03373D] mb-4 group-hover:scale-110 transition-transform duration-300"
            />
            <h3 className="font-semibold text-lg text-[#03373D] group-hover:text-black">
              {step.title}
            </h3>
            <p className="text-gray-600 mt-2 text-sm group-hover:text-black">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
