import React from 'react'
import {Outlet} from 'react-router'
import authImg from "../../assets/authImage.png";
import AuthNavbar from '../../Pages/Authentication/AuthNavbar/AuthNavbar'
const AuthenticationLayout = () => {
  return (
   <>
   <AuthNavbar></AuthNavbar>  
   
   <div className="min-h-[90vh] flex flex-col  justify-between lg:flex-row">
      {/* LEFT SIDE: Register Form */}
      <Outlet></Outlet>

      {/* RIGHT SIDE: Image */}
<div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 sm:px-12">
  <img
    src={authImg}
    alt="Delivery illustration"
    className="w-full hidden md:flex max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-3xl object-contain"
  />
</div>


    </div>
  
   </>
  )
}

export default AuthenticationLayout