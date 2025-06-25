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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
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
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
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
