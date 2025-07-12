import React from "react";
import loader from '../../../assets/animations/loading.json'
import Lottie from "lottie-react";
const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
     <Lottie animationData={loader} loop={true} />
    </div>
  );
};

export default Loader;
