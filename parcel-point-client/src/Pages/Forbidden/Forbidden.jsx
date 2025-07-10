import React from "react";
import { Link } from "react-router";
import { FaBan } from "react-icons/fa";

const Forbidden = () => {
  return (
    <section className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <FaBan className="text-red-500 text-7xl mb-6" />
      <h1 className="text-4xl font-bold text-[#03373D] mb-2">
        403 - Forbidden
      </h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>
      <Link to="/" className="btn bg-[#D8F45D] text-black">
        Back to Home
      </Link>
    </section>
  );
};

export default Forbidden;
