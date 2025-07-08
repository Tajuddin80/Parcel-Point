import React from "react";
import riderImg from "../../assets/agent-pending.png";
// import Lottie from "lottie-react";
import riderReact from '../../assets/animations/rider.json'
const regions = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const BeARider = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <section data-aos="fade-left" className="py-16 px-4 md:px-16 my-10 rounded-3xl shadow-md bg-white">
      {/* Header */}
      <div className="text-center md:text-left mb-10  mx-auto">
        <h2 className="text-3xl font-bold text-[#03373D]">Be a Rider</h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto md:mx-0">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>

      {/* Layout */}
      <div className="flex flex-col-reverse md:flex-row gap-10 items-start">
        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 w-full md:w-1/2">
          <h3 className="text-xl font-bold text-[#03373D] mb-4">
            Tell us about yourself
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Your Name
              </label>
              <input
                required
                type="text"
                name="name"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Your Age
              </label>
              <input
                required
                type="text"
                name="age"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Your Email
              </label>
              <input
                required
                type="email"
                name="email"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Your Region
              </label>
              <select
                required
                name="region"
                className="select select-bordered w-full"
              >
                <option>Select your region</option>
                {regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                NID No
              </label>
              <input
                required
                type="text"
                name="nid"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Contact
              </label>
              <input
                required
                type="text"
                name="contact"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-[#03373D]">
              Which warehouse do you want to work?
            </label>
            <select
              required
              name="warehouse"
              className="select select-bordered w-full"
            >
              <option>Select warehouse</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn bg-[#D8F45D] text-black w-full mt-4"
          >
            Submit
          </button>
        </form>

        {/* Image */}
        <div className="flex justify-center w-full md:w-1/2 mb-6 md:mb-0">
          
          {/* <Lottie animationData={riderReact} loop={true} /> */}
          
          <img
            src={riderImg}
            alt="Rider"
            className="max-w-xs sm:max-w-sm md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default BeARider;
