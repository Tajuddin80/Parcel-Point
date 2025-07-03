import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/RootLayout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AboutUs from "../Pages/AboutUs/AboutUs/AboutUs";
import BeARider from "../Pages/BeARider/BeARider";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import AuthenticationLayout from "../Layouts/AuthenticationLayout/AuthenticationLayout";
import PrivateRoute from "../Routes/PrivateRoute";
import CoveragePage from "../Pages/CoveragePage/CoveragePage";
import PublicRoute from "../Routes/PublicRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PricingCalculator from "../Pages/PricingCalculator/PricingCalculator";


// Define loader function
const homeLoader = async () => {
  const response = await fetch('/reviews.json'); // use absolute public path
  if (!response.ok) {
    throw new Error("Failed to load reviews");
  }
  return response.json();
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader
      },
      {
        path: "pricingCalculator",
        element: (
          // <PrivateRoute>
          <PricingCalculator />
          // </PrivateRoute>
        ),
      },
      
      {
        path: "sendParcel",
        element: (
          // <PrivateRoute>
          <SendParcel />
          // </PrivateRoute>
        ),
      },
      {
        path: "coverage",
        element: (
          // <PrivateRoute>
          <CoveragePage />
          // </PrivateRoute>
        ),
      },
      {
        path: "be-a-rider",
        element: (
          // <PrivateRoute>
          <BeARider />
          // </PrivateRoute>
        ),
      },
      {
        path: "aboutUs",
        element: <AboutUs />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthenticationLayout></AuthenticationLayout>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "signin",
        element: (
          <PublicRoute>
            <Login></Login>
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register></Register>
          </PublicRoute>
        ),
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
