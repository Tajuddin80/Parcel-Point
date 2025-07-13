import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import riderImg from "../../assets/agent-pending.png";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const BeARider = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [warehouseData, setWarehouseData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => {
        setWarehouseData(data);
        const uniqueRegions = [...new Set(data.map((item) => item.region))];
        setRegions(uniqueRegions);
      });
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = warehouseData
        .filter((item) => item.region === selectedRegion)
        .map((item) => item.district);
      const uniqueDistricts = [...new Set(filteredDistricts)];
      setDistricts(uniqueDistricts);
    } else {
      setDistricts([]);
    }
    setWarehouses([]); // clear downstream
  }, [selectedRegion, warehouseData]);

  useEffect(() => {
    if (selectedRegion && selectedDistrict) {
      const matched = warehouseData.find(
        (item) =>
          item.region === selectedRegion && item.district === selectedDistrict
      );
      setWarehouses(matched?.covered_area || []);
    } else {
      setWarehouses([]);
    }
  }, [selectedDistrict, selectedRegion, warehouseData]);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      photoURL: user?.photoURL,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/riders", riderData);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your application is pending approval.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      const status = error.response?.data?.status;

      let icon = "error";
      let title = "Submission Failed";
      let text = errorMsg;

      if (status === "pending") {
        icon = "info";
        title = "Already Applied";
        text = "Your application is under review. Please wait for approval.";
      } else if (status === "active") {
        icon = "warning";
        title = "Already a Rider";
        text = "You're already an approved rider.";
      } else if (status === "rejected") {
        icon = "error";
        title = "Application Rejected";
        text =
          "Your previous application was rejected. Please contact support.";
      }

      Swal.fire({
        icon,
        title,
        text,
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section className="py-16 px-4 md:px-16 my-10 rounded-3xl shadow-md bg-white">
      <Helmet>
        <title>Parcel Point | Be a Rider</title>
      </Helmet>
      <div className="text-center md:text-left mb-10 mx-auto">
        <h2 className="text-3xl font-bold text-[#03373D]">Be a Rider</h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto md:mx-0">
          Deliver fast, safe, and trackable parcels across Bangladesh.
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-10 items-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full md:w-1/2"
        >
          <h3 className="text-xl font-bold text-[#03373D] mb-4">
            Tell us about yourself
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Your Name
              </label>
              <input
                value={user?.displayName || ""}
                readOnly
                {...register("name", { required: "Name is required" })}
                className="input input-bordered w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Your Age
              </label>
              <input
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: {
                    value: 18,
                    message: "You must be at least 18 years old",
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Your Email
              </label>
              <input
                value={user?.email || ""}
                readOnly
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Region */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Region
              </label>
              <select
                {...register("region", { required: "Region is required" })}
                className="select select-bordered w-full"
              >
                <option value="">Select region</option>
                {regions.map((region, i) => (
                  <option key={i} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-red-500 text-sm">{errors.region.message}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                District
              </label>
              <select
                {...register("district", { required: "District is required" })}
                className="select select-bordered w-full"
              >
                <option value="">Select district</option>
                {districts.map((district, i) => (
                  <option key={i} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm">
                  {errors.district.message}
                </p>
              )}
            </div>

            {/* Covered Area (Warehouse) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Which warehouse do you want to work?
              </label>
              <select
                {...register("warehouse", {
                  required: "Warehouse is required",
                })}
                className="select select-bordered w-full"
              >
                <option value="">Select warehouse</option>
                {warehouses.map((area, i) => (
                  <option key={i} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {errors.warehouse && (
                <p className="text-red-500 text-sm">
                  {errors.warehouse.message}
                </p>
              )}
            </div>

            {/* NID */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                NID No
              </label>
              <input
                {...register("nid", {
                  required: "NID is required",
                  pattern: {
                    value: /^(?:\d{10}|\d{13}|\d{17})$/,
                    message: "NID must be 10, 13, or 17 digits",
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.nid && (
                <p className="text-red-500 text-sm">{errors.nid.message}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Contact
              </label>
              <input
                {...register("contact", {
                  required: "Contact is required",
                  pattern: {
                    value: /^01\d{9}$/,
                    message: "Must start with 01 and be 11 digits",
                  },
                })}
                className="input input-bordered w-full"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm">{errors.contact.message}</p>
              )}
            </div>

            {/* Bike Brand */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Bike Brand
              </label>
              <input
                {...register("bikeBrand", {
                  required: "Bike brand is required",
                })}
                className="input input-bordered w-full"
              />
              {errors.bikeBrand && (
                <p className="text-red-500 text-sm">
                  {errors.bikeBrand.message}
                </p>
              )}
            </div>

            {/* Bike Registration Number */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#03373D]">
                Bike Registration Number
              </label>
              <input
                {...register("bikeRegNumber", {
                  required: "Bike registration number is required",
                })}
                className="input input-bordered w-full"
              />
              {errors.bikeRegNumber && (
                <p className="text-red-500 text-sm">
                  {errors.bikeRegNumber.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-[#D8F45D] text-black w-full mt-4"
          >
            Appeal for Rider Position
          </button>
        </form>

        {/* Image */}
        <div className="flex justify-center w-full md:w-1/2 mb-6 md:mb-0">
          <img
            src={riderImg}
            alt="Rider"
            className="max-w-xs sm:max-w-sm md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default BeARider;
