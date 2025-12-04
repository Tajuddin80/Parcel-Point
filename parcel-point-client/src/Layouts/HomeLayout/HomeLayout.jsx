import { Outlet } from "react-router";
import Footer from "../../Pages/shared/Footer/Footer";
import Navbar from "../../Pages/shared/Navbar/Navbar";

const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-[150vh]">
      <div className="top-0 sticky z-90">
        <Navbar></Navbar>
      </div>
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default HomeLayout;
