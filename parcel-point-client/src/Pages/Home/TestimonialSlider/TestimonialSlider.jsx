import React, { useState } from "react";
import image from "../../../assets/customer-top.png";
import quoteImg from "../../../assets/reviewQuote.png";
const testimonials = [
  {
    quote:
      "Profast's delivery service exceeded our expectations — fast, reliable, and affordable. We trust them with all our important shipments.",
    name: "Rasel Ahamed",
    position: "CTO, TechGear Ltd.",
    image: "/images/user1.png",
  },
  {
    quote:
      "Working with Profast has streamlined our eCommerce logistics. Their live tracking feature keeps our customers happy.",
    name: "Awlad Hossin",
    position: "Senior Product Designer, ShopNest",
    image: "/images/user2.png",
  },
  {
    quote:
      "As a CEO, I appreciate the peace of mind Profast offers. Safe delivery and excellent customer support every time.",
    name: "Nasir Uddin",
    position: "CEO, GreenMart",
    image: "/images/user3.png",
  },
  {
    quote:
      "We've seen significant improvement in customer satisfaction since switching to Profast. Highly recommended!",
    name: "Shamim Reza",
    position: "Operations Manager, ElectroShop",
    image: "/images/user4.png",
  },
  {
    quote:
      "Fastest delivery service we've used so far. The team is responsive and professional.",
    name: "Tahmina Islam",
    position: "Founder, Craftify",
    image: "/images/user5.png",
  },
  {
    quote:
      "Their cash-on-delivery system is secure and smooth. A game changer for small businesses.",
    name: "Jannatul Ferdous",
    position: "Marketing Lead, StyleHub",
    image: "/images/user6.png",
  },
  {
    quote:
      "Profast's reverse logistics helped us reduce return hassles. Our customers love the easy exchange process.",
    name: "Faridul Haque",
    position: "Logistics Head, BookWorld",
    image: "/images/user7.png",
  },
  {
    quote:
      "I love how transparent the tracking system is — I can monitor every step of the delivery!",
    name: "Sadia Parvin",
    position: "Customer",
    image: "/images/user8.png",
  },
  {
    quote:
      "Their corporate services have supported our growth tremendously. Profast is truly a partner in success.",
    name: "Mehedi Hasan",
    position: "Supply Chain Manager, FoodiesBD",
    image: "/images/user9.png",
  },
  {
    quote:
      "Profast stands out for its punctuality and care. We’ve trusted them for over 2 years without a single complaint.",
    name: "Rafiqur Rahman",
    position: "Admin, OfficeMate",
    image: "/images/user10.png",
  }
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
  
    className="py-16 my-10 rounded-4xl px-4 md:px-16 bg-white text-center">
      {/* Heading */}
      <div className="mb-12">
        <img
          src={image} // optional top icon
          alt="icon"
          className="mx-auto mb-4 min-w-70 h-25"
        />
        <h2 className="text-2xl md:text-4xl font-bold text-[#03373D]">
          What our customers are saying
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>

      {/* Testimonial Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md px-6 py-8 text-left relative">
        <img src={quoteImg} alt="" />
        <p className="text-gray-700 mb-6">{testimonials[current].quote}</p>
        <div className="border-t border-dashed border-[#B6D9D4] pt-4 flex items-center gap-4">
          <img
            src={testimonials[current].image}
            alt={testimonials[current].name}
            className="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h4 className="text-[#03373D] font-semibold">
              {testimonials[current].name}
            </h4>
            <p className="text-sm text-gray-500">
              {testimonials[current].position}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          className="btn btn-circle bg-[#D8F45D] text-black hover:scale-105"
        >
          ←
        </button>
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-[#03373D]" : "bg-gray-300"
            }`}
          ></span>
        ))}
        <button
          onClick={nextSlide}
          className="btn btn-circle bg-[#D8F45D] text-black hover:scale-105"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default TestimonialSlider;
