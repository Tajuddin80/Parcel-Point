import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import GoogleSignButton from "../GoogleSignButton/GoogleSignButton";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Helmet } from "react-helmet";

const Login = () => {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const from = location.state?.from || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target?.email.value;
    const password = e.target?.password.value;

    signIn(email, password)
        .then(async (result) => {
             const user = result.user;
     
             // Prepare user info for backend
             const userInfo = {
               email: user.email,
               role: "user",
               last_log_in: new Date().toISOString(),
               created_at: new Date().toISOString(),
             };
     
             try {
               const userRes = await axiosPublic.post("/users", userInfo);
               console.log(userRes.data.message);
     
               let title = "Already logged in";
               if (userRes.data.inserted) {
                 title = "Welcome to Parcel Point";
               } else if (userRes.data.updated) {
                 title = "Welcome back!";
               }
     
               Swal.fire({
                 icon: "success",
                 title,
                 showConfirmButton: false,
                 timer: 1500,
                 timerProgressBar: true,
                 toast: true,
                 position: "center",
               });
     
               // Navigate after short delay (matches toast duration)
               setTimeout(() => {
                 navigate(from || "/", { replace: true });
               }, 1600); // a bit more than toast timer
             } catch (error) {
               console.error("Error saving user info:", error);
               Swal.fire({
                 icon: "error",
                 title: "Something went wrong",
                 text: error.message,
               });
             }
           })
           .catch((error) => {
             console.error("Google sign-in error:", error.message);
             Swal.fire({
               icon: "error",
               title: "Google Sign-in Failed",
               text: error.message,
             });
           });
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-8">
      <Helmet>
        <title>Parcel Point | Login</title>
      </Helmet>
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold mb-2">Welcome back</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="leroy@jenkins.com"
              className="w-full text-xl border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700"
              >
                Password
              </label>
              <a href="#" className="text-md text-green-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*****"
                name="password"
                className="w-full border text-xl border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // Eye open icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  // Eye closed icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.347 6.347A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.21 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <p className="text-md text-gray-600 mb-6">
            Don't have an account?
            <Link
              to={"/register"}
              className="ml-1 text-green-600 hover:underline"
            >
              Register here
            </Link>
          </p>
          <button
            type="submit"
            className="w-full bg-green-400 text-white font-semibold rounded-md py-2 hover:bg-green-500 transition"
          >
            Login
          </button>
        </form>
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <GoogleSignButton></GoogleSignButton>
      </div>
    </div>
  );
};

export default Login;
