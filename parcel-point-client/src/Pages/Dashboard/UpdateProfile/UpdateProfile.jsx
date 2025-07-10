import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import ImageUpload from "../../Authentication/ImageUpload/ImageUpload";
import { imageUpload } from "../../../api/utils";

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

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const imageUploadRef = useRef();

// const (data: UserMetadata, isLoading) = 

  const handleUpdateProfile = async () => {
    if (
      !imageUploadRef.current ||
      !imageUploadRef.current.isValidImageUploaded()
    ) {
      Swal.fire({
        icon: "info",
        title: "Upload Required",
        text: "Please upload a profile image.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const imageFile = imageUploadRef.current.getFile();
    const uploadedImageUrl = await imageUpload(imageFile);

    if (!uploadedImageUrl) {
      return Swal.fire("Error", "Image upload failed.", "error");
    }

    try {
      await updateProfile(user, {
        displayName,
        photoURL: uploadedImageUrl,
      });

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
        <label for="role" class="block text-left mb-1">Desired Role</label>
        <select id="role" class="swal2-input">
          <option value="Delivery Agent">Delivery Agent</option>
          <option value="Admin">Admin</option>
          <option value="Support">Support</option>
        </select>
        <label for="message" class="block text-left mt-3 mb-1">Reason</label>
        <textarea id="message" class="swal2-textarea" rows="3" placeholder="Why do you need this role?"></textarea>
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
      // Optional: Send this to backend
      console.log("Submitted Role Request:", formValues);
      Swal.fire(
        "Submitted",
        `Your request for ${formValues.role} has been sent.`,
        "success"
      );
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[90vh] bg-base-100 px-4 py-10">
      <motion.div
        className="relative w-full  bg-white rounded-3xl shadow-xl border border-base-300 p-10 space-y-10"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Profile Image */}
          <div className=" rounded-4xl overflow-hidden border-4 border-primary shadow-md">
            <img
              src={photoURL || "/default-user.png"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Fields */}
          <div className="text-center md:text-left w-full space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            {/* <div>
              <label className="text-sm font-semibold block mb-1">
                Upload New Photo
              </label><ImageUpload
                 ref={imageUploadRef}/>
            </div> */}

            <div className="text-gray-600">📧 {user?.email || "No email"}</div>
            <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm shadow">
              Role: {user?.role || "Customer"}
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
