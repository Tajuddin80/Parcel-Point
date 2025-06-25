import React from 'react'
import errorImg from '../../assets/animations/errorboy.json'
import { Link } from 'react-router'
import Lottie from 'lottie-react'
const ErrorPage = () => {
  return (
    <div className='md:min-h-100  flex-col flex justify-center items-center rounded-3xl shadow-lg '>
        <div className='md:my-10 my-5'><Lottie  animationData={errorImg} loop={true} />
        <h3 className='text-7xl text-center font-extrabold'>404</h3></div>
        <div><Link to={'/'} className='btn mb-10 md:mb-20 bg-[#CAEB66] rounded-lg'>Go to Home</Link></div>
    </div>
  )
}

export default ErrorPage