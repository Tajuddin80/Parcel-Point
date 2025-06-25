
import { Outlet } from "react-router";
import Footer from "../../Pages/shared/Footer/Footer";
import Navbar from "../../Pages/shared/Navbar/Navbar";

const RootLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
