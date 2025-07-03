import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  CheckCircle,
  PackageSearch,
  Clock,
  Mail,
  ArrowRight,
  Edit3,
} from "lucide-react";
import warehouseData from "../../assets/warehouses.json";
import useAuth from "../../hooks/useAuth";
const MySwal = withReactContent(Swal);

const SendParcel = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const parcelType = watch("parcelType", "Document");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const [senderWarehouses, setSenderWarehouses] = useState([]);
  const [receiverWarehouses, setReceiverWarehouses] = useState([]);
  const uniqueRegions = Array.from(new Set(warehouseData.map((w) => w.region)));

  useEffect(() => {
    if (senderRegion) {
      const list = Array.from(
        new Set(
          warehouseData
            .filter((w) => w.region === senderRegion)
            .map((w) => w.district)
        )
      );
      setSenderWarehouses(list);
      setValue("senderWarehouse", "");
    }
  }, [senderRegion, setValue]);

  useEffect(() => {
    if (receiverRegion) {
      const list = Array.from(
        new Set(
          warehouseData
            .filter((w) => w.region === receiverRegion)
            .map((w) => w.district)
        )
      );
      setReceiverWarehouses(list);
      setValue("receiverWarehouse", "");
    }
  }, [receiverRegion, setValue]);

  const generateTrackingId = () =>
    "TRK-" + Math.random().toString(36).substr(2, 9).toUpperCase();

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
    const trackingId = generateTrackingId();
    const currentTime = new Date().toISOString();
    const userEmail = user?.email || "guest@example.com";
    const costInfo = calculateCost(data);
    const orderData = {
      ...data,
      trackingId,
      createdAt: currentTime,
      userEmail,
      totalCost: costInfo.total,
    };

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
                <PackageSearch className="w-4 h-4" />{" "}
                <strong>Tracking ID</strong>
              </span>
              <span className="font-medium">{trackingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Mail className="w-4 h-4" /> <strong>User Email</strong>
              </span>
              <span className="font-medium">{userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" /> <strong>Created</strong>
              </span>
              <span className="font-medium">
                {new Date(currentTime).toLocaleString("en-US", {
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
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: (
        <span className="flex items-center gap-1">
          <ArrowRight className="w-4 h-4" /> Proceed
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
        console.log("Order Data:", orderData);
        Swal.fire("Redirecting to payment...", "", "success");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            {...register("parcelName", { required: true })}
            type="text"
            placeholder="Parcel Name"
            className="border rounded p-2 w-full"
          />
          {parcelType === "Not-Document" && (
            <input
              {...register("parcelWeight", { required: true })}
              type="number"
              step="0.01"
              placeholder="Parcel Weight (KG)"
              className="border rounded p-2 w-full"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Sender */}
          <div>
            <h3 className="font-semibold mb-2">Sender Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("senderName", { required: true })}
                placeholder="Sender Name"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("senderWarehouse", { required: true })}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Warehouse</option>
                {senderWarehouses.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                {...register("senderAddress", { required: true })}
                placeholder="Address"
                className="border rounded p-2 w-full"
              />
              <input
                {...register("senderContact", { required: true })}
                placeholder="Sender Contact No"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("senderRegion", { required: true })}
                className="border rounded p-2 w-full md:col-span-2"
              >
                <option value="">Select your region</option>
                {uniqueRegions.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <textarea
                {...register("pickupInstruction", { required: true })}
                placeholder="Pickup Instruction"
                className="border rounded p-2 w-full md:col-span-2"
              />
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="font-semibold mb-2">Receiver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("receiverName", { required: true })}
                placeholder="Receiver Name"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("receiverWarehouse", { required: true })}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Warehouse</option>
                {receiverWarehouses.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                {...register("receiverAddress", { required: true })}
                placeholder="Address"
                className="border rounded p-2 w-full"
              />
              <input
                {...register("receiverContact", { required: true })}
                placeholder="Receiver Contact No"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("receiverRegion", { required: true })}
                className="border rounded p-2 w-full md:col-span-2"
              >
                <option value="">Select your region</option>
                {uniqueRegions.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <textarea
                {...register("deliveryInstruction", { required: true })}
                placeholder="Delivery Instruction"
                className="border rounded p-2 w-full md:col-span-2"
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          * PickUp Time 4pm-7pm Approx.
        </p>

        <button
          type="submit"
          className="bg-lime-400 hover:bg-lime-500 text-white font-semibold rounded p-2 px-4"
        >
          Proceed to Confirm Booking
        </button>
      </form>
    </section>
  );
};

export default SendParcel;
