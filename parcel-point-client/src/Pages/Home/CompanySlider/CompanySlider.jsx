import React from "react";
import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/moonstar.png";
import logo5 from "../../../assets/brands/randstad.png";
import logo6 from "../../../assets/brands/start-people 1.png";
import logo7 from "../../../assets/brands/start.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const CompanySlider = () => {
  return (
    <div
      // data-aos="fade-right"
      className="py-20  rounded-4xl my-10 bg-white text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[#03373D] pb-10">
        We&apos;ve helped thousands of sales teams
      </h2>

      <div className="relative w-full overflow-x-hidden">
        <div className="flex w-max animate-slider">
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Company logo ${index + 1}`}
              className="h-6 md:h-7 mx-2"
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default CompanySlider;
