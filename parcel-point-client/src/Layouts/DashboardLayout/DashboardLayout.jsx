import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import ParcelPointLogo from "../../Pages/shared/ParcelPointLogo/ParcelPointLogo";
import { FaHome, FaBoxOpen, FaMoneyCheckAlt, FaSearchLocation, FaUserEdit } from "react-icons/fa";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded ${
    isActive ? "bg-[oklch(84.1%_0.238_128.85)] text-black font-semibold" : "hover:bg-gray-200"
  }`;
const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar for small screens */}
        <div className="w-full navbar bg-base-300 lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">Dashboard</div>
        </div>

        {/* Page content */}
        <div className="p-4"><Outlet></Outlet></div>
      </div>

      <div className="drawer-side">
        {/* Overlay only applies for small screens */}
        <label
          htmlFor="dashboard-drawer"
          className="drawer-overlay lg:hidden"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          <ParcelPointLogo></ParcelPointLogo>
     <li>
        <NavLink to="/" className={navLinkClass}>
          <FaHome /> Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/myParcels" className={navLinkClass}>
          <FaBoxOpen /> My Parcels
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/paymentHistory" className={navLinkClass}>
          <FaMoneyCheckAlt /> Payment History
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/trackPackage" className={navLinkClass}>
          <FaSearchLocation /> Track a Package
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/updateProfile" className={navLinkClass}>
          <FaUserEdit /> Update Profile
        </NavLink>
      </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
