import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const UpdateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [initialState, setInitialState] = useState({});

  const { data: userData } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      setInitialState({
        name: res.data.displayName || "",
        photo: res.data.photoURL || "",
      });
      return res.data;
    },
  });

  const handleUpdateProfile = async () => {
    if (displayName === initialState.name && photoURL === initialState.photo) {
      return Swal.fire({
        icon: "info",
        title: "No changes detected",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    try {
      await updateProfile(user, { displayName, photoURL });
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Update Failed", error.message, "error");
    }
  };

  const handleRoleRequest = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Request Role Change",
      html: `
        <div style="text-align: left">
          <label for="role" style="font-weight: 600;">Desired Role</label>
          <select id="role" class="swal2-select" style="margin-bottom: 1rem;">
            <option value="user">User</option>
            <option value="rider">Rider</option>
            <option value="admin">Admin</option>
          </select>

          <label for="message" style="font-weight: 600;">Reason</label>
          <textarea id="message" class="swal2-textarea" rows="3" placeholder="Why do you need this role?"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      focusConfirm: false,
      preConfirm: () => {
        const role = document.getElementById("role").value;
        const message = document.getElementById("message").value;
        if (!role || !message) {
          Swal.showValidationMessage("Please fill in all fields");
        }
        return { role, message };
      },
    });

    if (formValues) {
      if (formValues.role === "rider") {
        return navigate("/be-a-rider");
      }

      try {
        await axiosSecure.post("/roleRequests", {
          email: user?.email,
          currentRole: userData?.role || "customer",
          requestedRole: formValues.role,
          message: formValues.message,
          created_at: new Date().toISOString(),
        });

        Swal.fire({
          icon: "success",
          title: "Submitted",
          text: `Your request for ${formValues.role} has been sent.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("Error", "Failed to send role request.", "error");
      }
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[90vh] bg-base-100 px-4 py-10">
       <Helmet>
        <title>Parcel Point | Update Profile</title>
      </Helmet>
      <motion.div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-base-300 p-10 space-y-10"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Profile Image */}
          <div className="rounded-full overflow-hidden border-4 border-primary shadow-md w-48 h-48">
            <img
              src={photoURL || "/default-user.png"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Fields */}
          <div className="text-center md:text-left w-full space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Profile Photo URL</label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="text-gray-600">📧 {user?.email || "No email"}</div>
            <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm shadow">
              Role: {userData?.role || "Customer"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <button
            onClick={handleUpdateProfile}
            className="w-full py-3 px-6 bg-secondary text-white font-semibold rounded-full hover:bg-secondary-focus transition"
          >
            Update Profile
          </button>

          <button
            onClick={handleRoleRequest}
            className="w-full py-3 px-6 bg-base-200 text-base-content font-semibold rounded-full hover:bg-base-300 transition"
          >
            Request Role Change
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default UpdateProfile;
