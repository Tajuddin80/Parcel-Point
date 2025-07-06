import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import ParcelPointLogo from "../../Pages/shared/ParcelPointLogo/ParcelPointLogo";

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
            <NavLink to={'/dashboard/myParcels'}>My Parcels</NavLink>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
