import React from "react";
// import errorImg from "../../assets/ErrorImg.png";
import { Link } from "react-router";
import ErrorLottie from '../../assets/animations/404.json'
import Lottie from "lottie-react";
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-10 rounded-3xl shadow-lg bg-white">
      <div className="w-full max-w-md md:max-w-lg mx-auto my-5">
        {/* <img
          src={errorImg}
          alt="Error Illustration"
          className="w-full h-auto object-contain"
        /> */}
          <Lottie animationData={ErrorLottie} loop={true} />
      </div>
      <div>
        <Link
          to="/"
          className="btn bg-[#CAEB66] rounded-lg px-6 py-3 text-lg font-semibold hover:bg-[#b8d94e] transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
