import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  CheckCircle,
  PackageSearch,
  Clock,
  Copy,
  Mail,
  ArrowRight,
  Edit3,
  User,
} from "lucide-react";
import warehouseData from "../../assets/warehouses.json";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import useTrackingLogger from "../../hooks/useTrackingLogger";
import { Helmet } from "react-helmet";

const MySwal = withReactContent(Swal);

const SendParcel = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { logTracking } = useTrackingLogger();

  // Watch parcel type for conditional weight input
  const parcelType = watch("parcelType", "Document");

  // Sender cascading selects
  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [senderWarehouses, setSenderWarehouses] = useState([]);

  // Receiver cascading selects
  const receiverRegion = watch("receiverRegion");
  const receiverDistrict = watch("receiverDistrict");
  const [receiverDistricts, setReceiverDistricts] = useState([]);
  const [receiverWarehouses, setReceiverWarehouses] = useState([]);

  // Contact type states (Mobile / Tel) for validation
  const [senderContactType, setSenderContactType] = useState("Mobile");
  const [receiverContactType, setReceiverContactType] = useState("Mobile");

  // Unique regions list
  const uniqueRegions = Array.from(new Set(warehouseData.map((w) => w.region)));

  // Update sender districts when senderRegion changes
  useEffect(() => {
    if (senderRegion) {
      const districts = warehouseData
        .filter((w) => w.region === senderRegion)
        .map((w) => w.district);
      setSenderDistricts([...new Set(districts)]);
      setValue("senderDistrict", "");
      setSenderWarehouses([]);
      setValue("senderWarehouse", "");
    } else {
      setSenderDistricts([]);
      setSenderWarehouses([]);
      setValue("senderDistrict", "");
      setValue("senderWarehouse", "");
    }
  }, [senderRegion, setValue]);

  // Update sender warehouses when senderDistrict changes
  useEffect(() => {
    if (senderRegion && senderDistrict) {
      const entry = warehouseData.find(
        (w) => w.region === senderRegion && w.district === senderDistrict
      );
      if (entry) {
        setSenderWarehouses(entry.covered_area);
        setValue("senderWarehouse", "");
      } else {
        setSenderWarehouses([]);
        setValue("senderWarehouse", "");
      }
    } else {
      setSenderWarehouses([]);
      setValue("senderWarehouse", "");
    }
  }, [senderRegion, senderDistrict, setValue]);

  // Update receiver districts when receiverRegion changes
  useEffect(() => {
    if (receiverRegion) {
      const districts = warehouseData
        .filter((w) => w.region === receiverRegion)
        .map((w) => w.district);
      setReceiverDistricts([...new Set(districts)]);
      setValue("receiverDistrict", "");
      setReceiverWarehouses([]);
      setValue("receiverWarehouse", "");
    } else {
      setReceiverDistricts([]);
      setReceiverWarehouses([]);
      setValue("receiverDistrict", "");
      setValue("receiverWarehouse", "");
    }
  }, [receiverRegion, setValue]);

  // Update receiver warehouses when receiverDistrict changes
  useEffect(() => {
    if (receiverRegion && receiverDistrict) {
      const entry = warehouseData.find(
        (w) => w.region === receiverRegion && w.district === receiverDistrict
      );
      if (entry) {
        setReceiverWarehouses(entry.covered_area);
        setValue("receiverWarehouse", "");
      } else {
        setReceiverWarehouses([]);
        setValue("receiverWarehouse", "");
      }
    } else {
      setReceiverWarehouses([]);
      setValue("receiverWarehouse", "");
    }
  }, [receiverRegion, receiverDistrict, setValue]);

  const generateTrackingId = () =>
    "TRK-" +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substr(2, 4).toUpperCase();

  const calculateCost = (data) => {
    const isSameCity = data.senderRegion === data.receiverRegion;
    const type = data.parcelType;
    const weight = parseFloat(data.parcelWeight || 0);

    let base = 0,
      extraPerKg = 0,
      extraOut = 0,
      total = 0;

    if (type === "Document") {
      base = isSameCity ? 60 : 80;
      total = base;
    } else {
      if (weight <= 3) {
        base = isSameCity ? 110 : 150;
        total = base;
      } else {
        base = isSameCity ? 110 : 150;
        const extraKg = weight - 3;
        extraPerKg = extraKg * 40;
        extraOut = isSameCity ? 0 : 40;
        total = base + extraPerKg + extraOut;
      }
    }

    const line = (label, value) => (
      <div className="flex justify-between text-sm md:text-base">
        <span>{label}</span>
        <span className="font-medium">৳{value}</span>
      </div>
    );

    const breakdownContent = (
      <div className="space-y-1 text-left">
        <div className="font-semibold text-lg flex items-center gap-1 mb-1">
          <PackageSearch className="w-4 h-4" /> {type}
        </div>
        {type !== "Document" && (
          <>
            <div className="text-sm mb-1">
              Weight: <strong>{weight} kg</strong>
            </div>
            {line(`Base price (up to 3kg)`, isSameCity ? 110 : 150)}
            {weight > 3 && (
              <>
                {line(`Extra (${(weight - 3).toFixed(2)}kg × 40)`, extraPerKg)}
                {!isSameCity && line(`Outside District Extra`, extraOut)}
              </>
            )}
          </>
        )}
        {type === "Document" && line("Base Price", base)}
        <div className="border-t border-dashed my-2"></div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>৳{total}</span>
        </div>
      </div>
    );

    return { total, breakdown: breakdownContent };
  };

  const onSubmit = (data) => {
    const {
      senderRegion,
      senderDistrict,
      senderWarehouse,
      receiverRegion,
      receiverDistrict,
      receiverWarehouse,
    } = data;

    const isSameLocation =
      senderRegion === receiverRegion &&
      senderDistrict === receiverDistrict &&
      senderWarehouse === receiverWarehouse;

    if (isSameLocation) {
      return MySwal.fire({
        icon: "error",
        title: "Invalid Destination",
        text: "Sender and receiver destinations cannot be exactly the same. Please choose a different receiver location.",
        confirmButtonColor: "#CAEB66",
      });
    }

    const costInfo = calculateCost(data);
    const userEmail = user?.email || "guest@example.com";
    const userName = user?.displayName || "guest";

    MySwal.fire({
      icon: "",
      title: (
        <div className="flex items-center gap-2 text-[#03373D]">
          <CheckCircle className="w-5 h-5 text-lime-500" /> Parcel Summary
        </div>
      ),
      html: (
        <div className="text-sm md:text-base text-left">
          {costInfo.breakdown}
          <div className="mt-3 p-3 border border-[#B6D9D4] rounded bg-[#F0F9F8] space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <User className="w-4 h-4" /> <strong>User Name</strong>
              </span>
              <span className="font-medium">{userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Mail className="w-4 h-4" /> <strong>User Email</strong>
              </span>
              <span className="font-medium">{userEmail}</span>
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: (
        <span className="flex items-center gap-1">
          <ArrowRight className="w-4 h-4" /> Proceed to Payment
        </span>
      ),
      cancelButtonText: (
        <span className="flex items-center gap-1">
          <Edit3 className="w-4 h-4" /> Edit
        </span>
      ),
      customClass: {
        popup: "rounded-2xl shadow-lg",
        confirmButton:
          "bg-lime-400 hover:bg-lime-500 text-[#03373D] font-semibold rounded px-4 py-2",
        cancelButton:
          "bg-white border border-[#B6D9D4] text-gray-600 font-medium rounded px-4 py-2",
      },
      width: "600px",
      background: "#fff",
      backdrop: "rgba(0, 0, 0, 0.4)",
    }).then((result) => {
      if (result.isConfirmed) {
        const trackingId = generateTrackingId();
        const createdAt = new Date();

        const orderData = {
          ...data,
          trackingId,
          deliveryStatus: "not_collected",
          paymentStatus: "unpaid",
          createdAt: createdAt.toISOString(),
          created_by: userEmail,
          totalCost: costInfo.total,
        };

        axiosSecure.post("/parcels", orderData).then((res) => {
          if (res.data.insertedId) {
            MySwal.fire({
              html: (
                <div className="text-left text-sm md:text-base">
                  <Helmet>
                    <title>Parcel Point | Send Parcel</title>
                  </Helmet>
                  <div className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    Your tracking ID:
                    <span className="text-lime-600">{trackingId}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(trackingId);
                        Swal.fire({
                          toast: true,
                          position: "top-end",
                          icon: "success",
                          title: "Tracking ID copied!",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      }}
                      className="text-gray-500 hover:text-lime-600"
                      title="Copy Tracking ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-bold text-gray-700 mb-2">
                    Order placing time:{" "}
                    <span className="text-lime-600">
                      {createdAt.toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="border-t border-dashed my-2"></div>
                  <div className="text-gray-700">Full Order Summary:</div>
                  {costInfo.breakdown}
                </div>
              ),
              confirmButtonText: "OK",
              customClass: {
                popup: "rounded-2xl shadow-lg",
                confirmButton:
                  "bg-lime-400 hover:bg-lime-500 text-[#03373D] font-semibold rounded px-4 py-2",
              },
            }).then(async () => {
              // parcel tracking update
              await logTracking({
                tracking_id: orderData.trackingId,
                status: "parcel is created",
                details: `Created by ${user.displayName}`,
                updated_by: `Email: ${user.email}`,
              });

              navigate("/dashboard/myParcels");
            });
          }
        });
      }
    });
  };

  return (
    <section className="w-full lg:w-[80vw] mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Add Parcel
      </h1>
      <div className="border-b mb-6"></div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-semibold mb-4">
          Enter your parcel details
        </h2>

        {/* PARCEL TYPE */}
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Document"
              {...register("parcelType")}
              defaultChecked
            />
            <span>Document</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Not-Document"
              {...register("parcelType")}
            />
            <span>Not-Document</span>
          </label>
        </div>

        {/* PARCEL NAME + WEIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              {...register("parcelName", {
                required: "Parcel name is required",
              })}
              type="text"
              placeholder="Parcel Name"
              className={`border rounded p-2 w-full ${
                errors.parcelName ? "border-red-500" : ""
              }`}
            />
            {errors.parcelName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parcelName.message}
              </p>
            )}
          </div>

          {parcelType === "Not-Document" && (
            <div>
              <input
                {...register("parcelWeight", {
                  required: "Parcel weight is required",
                  min: { value: 0.01, message: "Weight must be positive" },
                })}
                type="number"
                step="0.01"
                placeholder="Parcel Weight (KG)"
                className={`border rounded p-2 w-full ${
                  errors.parcelWeight ? "border-red-500" : ""
                }`}
              />
              {errors.parcelWeight && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.parcelWeight.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* SENDER DETAILS */}
          <div>
            <h3 className="font-semibold mb-2">Sender Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("senderName", {
                    required: "Sender name is required",
                  })}
                  placeholder="Sender Name"
                  className={`border rounded p-2 w-full ${
                    errors.senderName ? "border-red-500" : ""
                  }`}
                />
                {errors.senderName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderName.message}
                  </p>
                )}
              </div>

              {/* Sender Region */}
              <div>
                <select
                  {...register("senderRegion", {
                    required: "Select sender region",
                  })}
                  className={`border rounded p-2 w-full ${
                    errors.senderRegion ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select your region</option>
                  {uniqueRegions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.senderRegion && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderRegion.message}
                  </p>
                )}
              </div>

              {/* Sender District */}
              <div>
                <select
                  {...register("senderDistrict", {
                    required: "Select sender district",
                  })}
                  className={`border rounded p-2 w-full ${
                    errors.senderDistrict ? "border-red-500" : ""
                  }`}
                  disabled={!senderDistricts.length}
                >
                  <option value="">Select your district</option>
                  {senderDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.senderDistrict && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderDistrict.message}
                  </p>
                )}
              </div>

              {/* Sender Warehouse */}
              <div>
                <select
                  {...register("senderWarehouse", {
                    required: "Select sender warehouse",
                  })}
                  className={`border rounded p-2 w-full ${
                    errors.senderWarehouse ? "border-red-500" : ""
                  }`}
                  disabled={!senderWarehouses.length}
                >
                  <option value="">Select warehouse (covered area)</option>
                  {senderWarehouses.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                {errors.senderWarehouse && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderWarehouse.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("senderAddress", {
                    required: "Sender address is required",
                  })}
                  placeholder="Address"
                  className={`border rounded p-2 w-full ${
                    errors.senderAddress ? "border-red-500" : ""
                  }`}
                />
                {errors.senderAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.senderAddress.message}
                  </p>
                )}
              </div>

              {/* Sender Contact Number */}
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register("senderContact", {
                      required: "Sender contact is required",
                      validate: (value) => {
                        if (!value) return "Sender contact is required";
                        if (senderContactType === "Mobile") {
                          return (
                            /^01[0-9]{9}$/.test(value) ||
                            "Mobile must start with 01 and be 11 digits"
                          );
                        } else if (senderContactType === "Tel") {
                          return (
                            /^0[2-9][0-9]{7,8}$/.test(value) ||
                            "Tel must start with 0X and be 9-10 digits"
                          );
                        }
                        return true;
                      },
                    })}
                    placeholder="Contact No"
                    className={`border rounded p-2 w-full ${
                      errors.senderContact ? "border-red-500" : ""
                    }`}
                  />
                  {errors.senderContact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.senderContact.message}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    value={senderContactType}
                    onChange={(e) => setSenderContactType(e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="Mobile">Mobile</option>
                    <option value="Tel">Tel</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <textarea
                  {...register("senderPickupInstruction", {
                    required: "Pickup instruction is required",
                  })}
                  placeholder="Pickup Instruction"
                  className={`border rounded p-2 w-full ${
                    errors.pickupInstruction ? "border-red-500" : ""
                  }`}
                />
                {errors.pickupInstruction && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pickupInstruction.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RECEIVER DETAILS */}
          <div>
            <h3 className="font-semibold mb-2">Receiver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("receiverName", {
                    required: "Receiver name is required",
                  })}
                  placeholder="Receiver Name"
                  className={`border rounded p-2 w-full ${
                    errors.receiverName ? "border-red-500" : ""
                  }`}
                />
                {errors.receiverName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverName.message}
                  </p>
                )}
              </div>

              {/* Receiver Region */}
              <div>
                <select
                  {...register("receiverRegion", {
                    required: "Select receiver region",
                  })}
                  className={`border rounded p-2 w-full ${
                    errors.receiverRegion ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select your region</option>
                  {uniqueRegions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.receiverRegion && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverRegion.message}
                  </p>
                )}
              </div>

              {/* Receiver District */}
              <div>
                <select
                  {...register("receiverDistrict", {
                    required: "Select receiver district",
                  })}
                  className={`border rounded p-2 w-full ${
                    errors.receiverDistrict ? "border-red-500" : ""
                  }`}
                  disabled={!receiverDistricts.length}
                >
                  <option value="">Select your district</option>
                  {receiverDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.receiverDistrict && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverDistrict.message}
                  </p>
                )}
              </div>

              {/* Receiver Warehouse */}
              <div>
                <select
                  {...register("receiverWarehouse", {
                    required: "Select receiver warehouse",
                  })}
                  className={`border rounded p-2 w-full ${
                    errors.receiverWarehouse ? "border-red-500" : ""
                  }`}
                  disabled={!receiverWarehouses.length}
                >
                  <option value="">Select warehouse (covered area)</option>
                  {receiverWarehouses.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                {errors.receiverWarehouse && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverWarehouse.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("receiverAddress", {
                    required: "Receiver address is required",
                  })}
                  placeholder="Address"
                  className={`border rounded p-2 w-full ${
                    errors.receiverAddress ? "border-red-500" : ""
                  }`}
                />
                {errors.receiverAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.receiverAddress.message}
                  </p>
                )}
              </div>

              {/* Receiver Contact Number */}
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register("receiverContact", {
                      required: "Receiver contact is required",
                      validate: (value) => {
                        if (!value) return "Receiver contact is required";
                        if (receiverContactType === "Mobile") {
                          return (
                            /^01[0-9]{9}$/.test(value) ||
                            "Mobile must start with 01 and be 11 digits"
                          );
                        } else if (receiverContactType === "Tel") {
                          return (
                            /^0[2-9][0-9]{7,8}$/.test(value) ||
                            "Tel must start with 0X and be 9-10 digits"
                          );
                        }
                        return true;
                      },
                    })}
                    placeholder="Contact No"
                    className={`border rounded p-2 w-full ${
                      errors.receiverContact ? "border-red-500" : ""
                    }`}
                  />
                  {errors.receiverContact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverContact.message}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    value={receiverContactType}
                    onChange={(e) => setReceiverContactType(e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value="Mobile">Mobile</option>
                    <option value="Tel">Tel</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <textarea
                  {...register("receiverDeliveryInstruction", {
                    required: "Delivery instruction is required",
                  })}
                  placeholder="Delivery Instruction"
                  className={`border rounded p-2 w-full ${
                    errors.deliveryInstruction ? "border-red-500" : ""
                  }`}
                />
                {errors.deliveryInstruction && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deliveryInstruction.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#CAEB66] btn cursor-pointer text-[#03373D] font-semibold py-3 rounded text-lg"
        >
          Send Parcel
        </button>
      </form>
    </section>
  );
};

export default SendParcel;
