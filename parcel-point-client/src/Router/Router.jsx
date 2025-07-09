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
// import PublicRoute from "../Routes/PublicRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PricingCalculator from "../Pages/PricingCalculator/PricingCalculator";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import UpdateProfile from "../Pages/Dashboard/UpdateProfile/UpdateProfile";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import Dashboard from "../Pages/Dashboard/Dashboard/Dasboard";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";

// Define loader function
const homeLoader = async () => {
  const response = await fetch("/reviews.json"); // use absolute public path
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
        loader: homeLoader,
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
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
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
          // <PublicRoute>
          <Login></Login>
          // </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          // <PublicRoute>
          <Register></Register>
          // </PublicRoute>
        ),
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>,
      },
      {
        path: "myParcels",
        element: <MyParcels></MyParcels>,
      },
      {
        path: "paymentHistory",
        element: <PaymentHistory></PaymentHistory>,
      },
      {
        path: "trackParcel",
        element: <TrackParcel></TrackParcel>,
      },
      {
        path: "activeRiders",
        element: <ActiveRiders></ActiveRiders>,
      },
      {
        path: "pendingRiders",
        element: <PendingRiders></PendingRiders>,
      },
      {
        path: "updateProfile",
        element: <UpdateProfile></UpdateProfile>,
      },

      {
        path: "payment/:parcelId",
        element: <Payment></Payment>,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
