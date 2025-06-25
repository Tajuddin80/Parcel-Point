import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const ParcelPointLogo = () => {
  return (
    <Link
    to={'/'}
      rel="noopener noreferrer"
      className="flex items-center  space-x-2 sm:space-x-3 md:space-x-4 lg:justify-start justify-center"
    >
      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full">
        <img
          src={logo}
          alt="Parcel Point Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-extrabold  -ml-7 mt-4 md:-ml-10 md:mt-6 text-xl sm:text-xl lg:text-3xl">
        Parcel Point
      </span>
    </Link>
  );
};

export default ParcelPointLogo;
