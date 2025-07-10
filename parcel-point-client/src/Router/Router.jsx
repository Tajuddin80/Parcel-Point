import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout/HomeLayout";
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
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "../Routes/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import RiderRoute from "../Routes/RiderRoutes";

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
        path: "forbidden",
        element: <Forbidden></Forbidden>,
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
        path: "updateProfile",
        element: <UpdateProfile></UpdateProfile>,
      },

      {
        path: "payment/:parcelId",
        element: <Payment></Payment>,
      },

      // rider only routes

      {
        path: "pendingDeliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoute>
        ),
      },

      // admin only routes
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        ),
      },
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: "assignRider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
