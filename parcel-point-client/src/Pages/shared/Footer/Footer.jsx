
import { FaLinkedin, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";
import ParcelPointLogo from "../ParcelPointLogo/ParcelPointLogo";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 py-10 text-center space-y-5 rounded-t-3xl">
      
      {/* Logo + Description */}
      <div className="flex flex-col items-center space-y-4 px-4">
       <ParcelPointLogo></ParcelPointLogo>
        <p className="max-w-xl text-gray-300 text-sm md:text-base">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
          From personal packages to business shipments — we deliver on time, every time.
        </p>
      </div>

      <hr className="border-dashed border-cyan-800 mx-auto w-11/12" />

      {/* Navigation Links */}
      <nav className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-gray-200">
        <a className="hover:text-white" href="#">Services</a>
        <a className="hover:text-white" href="#">Coverage</a>
        <a className="hover:text-white" href="#">About Us</a>
        <a className="hover:text-white" href="#">Pricing</a>
        <a className="hover:text-white" href="#">Blog</a>
        <a className="hover:text-white" href="#">Contact</a>
      </nav>

      <hr className="border-dashed border-cyan-800 mx-auto w-11/12" />

      {/* Social Icons */}
      <div className="flex justify-center gap-4">
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="text-2xl text-[#03373D] hover:text-[#CAEB66] transition" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter className="text-2xl text-[#03373D] hover:text-[#CAEB66] transition" />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebook className="text-2xl text-[#03373D] hover:text-[#CAEB66] transition" />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <FaYoutube className="text-2xl text-[#03373D] hover:text-[#CAEB66] transition" />
        </a>
      </div>

      <div className="text-xs text-gray-500">
        © {new Date().getFullYear()} Parcel Point. All rights reserved.
      </div>
    </footer>
  );
}
