import React, { useState, forwardRef, useImperativeHandle } from "react";
import defaultProfile from "../../../assets/default.png";
import Swal from "sweetalert2";

const ImageUpload = forwardRef((props, ref) => {
  const [preview, setPreview] = useState(defaultProfile);
  const [file, setFile] = useState(null);

  useImperativeHandle(ref, () => ({
    isValidImageUploaded: () => !!file,
    getFile: () => file,
  }));

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        Swal.fire("Invalid", "Please upload a valid image", "info");
        return;
      }
      if (selectedFile.size > 500 * 1024) {
        Swal.fire("Too Large", "Max size 500KB", "info");
        return;
      }

      setPreview(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setPreview(defaultProfile);
    setFile(null);
  };

  return (
    <div className="flex flex-col items-start">
      <label htmlFor="profileImage" className="cursor-pointer relative group">
        <img
          src={preview}
          alt="Upload profile"
          className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2h2v2h-2l-1 10H5L4 7H2V5h2zM6 7l1 9h6l1-9H6z"></path>
          </svg>
        </div>
      </label>
      <input
        type="file"
        id="profileImage"
        name="profileImage"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {preview !== defaultProfile && (
        <button
          onClick={handleRemoveImage}
          className="mt-2 btn text-xs text-red-500 hover:underline"
        >
          Remove Image
        </button>
      )}
    </div>
  );
});

export default ImageUpload;
