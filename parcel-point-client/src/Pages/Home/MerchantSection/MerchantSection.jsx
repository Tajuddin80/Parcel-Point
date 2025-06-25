import React from "react";
import marchantSectionImg from "../../../assets/location-merchant.png";
import topImg from "../../../assets/be-a-merchant-bg.png";

const MerchantSection = () => {
  return (
    <div 
    // data-aos="fade-right" 
    className="bg-[#00383E]  relative rounded-[40px] px-4 sm:px-6 md:px-12 lg:px-20 py-12 text-white overflow-hidden ">
      {/* Top image as background effect */}
      <img
        src={topImg}
        className="absolute top-0 w-full h-auto object-contain pointer-events-none"
        alt=""
      />

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 relative">
        {/* Left: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
            Merchant and Customer Satisfaction{" "}
            <br className="hidden sm:block" />
            is Our First Priority
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-200">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button className="btn bg-[#D8F45D] text-black font-semibold px-6 py-3 rounded-full border-none hover:scale-105 transition">
              Become a Merchant
            </button>
            <button className="btn bg-transparent border border-[#D8F45D] text-[#D8F45D] font-semibold px-6 py-3 rounded-full hover:bg-[#D8F45D] hover:text-black transition">
              Earn with Profast Courier
            </button>
          </div>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <img
            src={marchantSectionImg}
            alt="Delivery Illustration"
            className="w-3/4 sm:w-2/3 md:w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default MerchantSection;
