import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import ImageUpload from "../ImageUpload/ImageUpload";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import GoogleSignButton from "../GoogleSignButton/GoogleSignButton";
import { updateProfile } from "firebase/auth";
import { imageUpload } from "../../../api/utils";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const imageUploadRef = useRef();
  const { createUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // ✅ Check if image uploaded
    if (
      !imageUploadRef.current ||
      !imageUploadRef.current.isValidImageUploaded()
    ) {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Please upload a profile image.",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const imageFile = imageUploadRef.current.getFile();

    try {
      // ✅ Upload image to imgbb
      const imageUrl = await imageUpload(imageFile);

      if (!imageUrl) {
        Swal.fire("Image upload failed", "Please try again", "error");
        return;
      }

      // ✅ Create user with email & password
      const result = await createUser(data.email, data.password);
      const user = result.user;

      // ✅ Update profile
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: imageUrl,
      });

      Swal.fire({
        icon: "success",
        title: "Registration successful!",
      });

      navigate(from, { replace: true });

    } catch (error) {
      console.error("Registration error:", error.message);
      Swal.fire("Error", error.message, "error");
    }
  };

  

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-8">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold mb-2">Create an Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h4 className="text-xl">Upload image</h4>
          <ImageUpload ref={imageUploadRef} />

          <div>
            <label htmlFor="displayName" className="block text-lg font-medium text-gray-700">Name</label>
            <input
              {...register("displayName", { required: true })}
              type="text"
              id="displayName"
              placeholder="Name"
              className="w-full text-xl border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.displayName && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email address</label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder="leroy@jenkins.com"
              className="w-full text-xl border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
              <a href="#" className="text-md text-green-600 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /[!@#$%^&*(),.?":{}|<>]/,
                    message: "Password must contain at least one special character",
                  },
                })}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="*****"
                className="w-full border text-xl border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  // eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  // eye off icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.347 6.347A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.21 5.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="text-md text-gray-600 mb-6">
            Already have an account?
            <Link to="/signin" className="ml-1 text-green-600 hover:underline">
              Login here
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-green-400 text-white font-semibold rounded-md py-2 hover:bg-green-500 transition"
          >
            Register
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <GoogleSignButton />
      </div>
    </div>
  );
};

export default Register;
