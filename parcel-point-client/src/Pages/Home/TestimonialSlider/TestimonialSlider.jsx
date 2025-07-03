import React, { useState } from "react";
import { useLoaderData } from "react-router";
import image from "../../../assets/customer-top.png";
import quoteImg from "../../../assets/reviewQuote.png";

const TestimonialSlider = () => {
  const reviews = useLoaderData();
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const currentReview = reviews[current];

  return (
    <section className="py-16 my-10 rounded-4xl px-4 md:px-16 bg-white text-center">
      {/* Heading */}
      <div className="mb-12">
        <img
          src={image}
          alt="icon"
          className="mx-auto mb-4 min-w-70 h-25"
        />
        <h2 className="text-2xl md:text-4xl font-bold text-[#03373D]">
          What our customers are saying
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Real feedback from customers who have experienced our delivery services!
        </p>
      </div>

      {/* Testimonial Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md px-6 py-8 text-left relative">
        <img src={quoteImg} alt="" className="mb-4" />
        <p className="text-gray-700 mb-6">"{currentReview.review}"</p>
        <div className="border-t border-dashed border-[#B6D9D4] pt-4 flex items-center gap-4">
          <img
            src={currentReview.user_photoURL}
            alt={currentReview.userName}
            className="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h4 className="text-[#03373D] font-semibold">
              {currentReview.userName}
            </h4>
            <p className="text-sm text-gray-500">
              Rating: {currentReview.ratings} ★
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
        {reviews.map((_, index) => (
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
