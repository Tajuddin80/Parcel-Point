import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import warehouseData from "../../assets/warehouses.json";

const SendParcel = () => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
  const parcelType = watch("parcelType", "Document");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");
  
  const [senderWarehouses, setSenderWarehouses] = useState([]);
  const [receiverWarehouses, setReceiverWarehouses] = useState([]);
  
  const uniqueRegions = Array.from(new Set(warehouseData.map(w => w.region)));

  const getDistrictsByRegion = (region) => {
    return Array.from(
      new Set(
        warehouseData
          .filter(w => w.region === region)
          .map(w => w.district)
      )
    );
  };

  useEffect(() => {
    if (senderRegion) {
      setSenderWarehouses(getDistrictsByRegion(senderRegion));
      setValue("senderWarehouse", "");
    }
  }, [senderRegion, setValue]);

  useEffect(() => {
    if (receiverRegion) {
      setReceiverWarehouses(getDistrictsByRegion(receiverRegion));
      setValue("receiverWarehouse", "");
    }
  }, [receiverRegion, setValue]);

const calculateCost = (data) => {
  const isSameCity = data.senderRegion === data.receiverRegion;
  const type = data.parcelType;
  const weight = parseFloat(data.parcelWeight || 0);

  let base = 0, extraPerKg = 0, extraOut = 0, total = 0;
  let breakdown = "";

  const line = (label, value) =>
    `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>${label}</span>
      <span><strong>৳${value}</strong></span>
    </div>`;

  if (type === "Document") {
    base = isSameCity ? 60 : 80;
    breakdown += `<div style="font-weight:bold; font-size:1.2rem;">📄 Document</div>`;
    breakdown += line("Base Price", base);
    total = base;
  } else {
    breakdown += `<div style="font-weight:bold; font-size:1.2rem;">Non-Document</div>`;
    breakdown += `<div style="margin-bottom:4px;">Weight: <strong>${weight}kg</strong></div>`;
    if (weight <= 3) {
      base = isSameCity ? 110 : 150;
      breakdown += line("Base Price (up to 3kg)", base);
      total = base;
    } else {
      base = isSameCity ? 110 : 150;
      const extraKg = weight - 3;
      extraPerKg = extraKg * 40;
      breakdown += line("Base Price (first 3kg)", base);
      breakdown += line(`Extra Weight (${extraKg}kg × 40)`, extraPerKg);
      if (!isSameCity) {
        extraOut = 40;
        breakdown += line("Outside District Extra", extraOut);
      }
      total = base + extraPerKg + extraOut;
    }
  }

  breakdown += `<hr style="margin:8px 0;">`;
  breakdown += `<div style="display:flex; justify-content:space-between; font-size:1.3rem; font-weight:bold;">
    <span>Total</span>
    <span>৳${total}</span>
  </div>`;

  return { total, breakdown };
};

const onSubmit = (data) => {
  const { total, breakdown } = calculateCost(data);

  Swal.fire({
    title: "📦 Parcel Cost Summary",
    html: `<div style="text-align:left; font-size:1.1rem; line-height:1.4;">${breakdown}</div>`,
    icon: "info",
    width: "650px", // Slightly bigger
    showCancelButton: true,
    confirmButtonText: "Proceed to Payment",
    cancelButtonText: "Edit",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Redirecting to payment...", "", "success");
    }
  });
};



  return (
    <section className="w-full lg:w-[80vw] mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Add Parcel</h1>
      <div className="border-b mb-6"></div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-semibold mb-4">Enter your parcel details</h2>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" value="Document" {...register("parcelType")} defaultChecked />
            <span>Document</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="Not-Document" {...register("parcelType")} />
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
              <input {...register("senderName", { required: true })} placeholder="Sender Name" className="border rounded p-2 w-full" />
              <select {...register("senderWarehouse", { required: true })} className="border rounded p-2 w-full">
                <option value="">Select Warehouse</option>
                {senderWarehouses.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>
              <input {...register("senderAddress", { required: true })} placeholder="Address" className="border rounded p-2 w-full" />
              <input {...register("senderContact", { required: true })} placeholder="Sender Contact No" className="border rounded p-2 w-full" />
              <select {...register("senderRegion", { required: true })} className="border rounded p-2 w-full md:col-span-2">
                <option value="">Select your region</option>
                {uniqueRegions.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
              <textarea {...register("pickupInstruction", { required: true })} placeholder="Pickup Instruction" className="border rounded p-2 w-full md:col-span-2" />
            </div>
          </div>

          {/* Receiver */}
          <div>
            <h3 className="font-semibold mb-2">Receiver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input {...register("receiverName", { required: true })} placeholder="Receiver Name" className="border rounded p-2 w-full" />
              <select {...register("receiverWarehouse", { required: true })} className="border rounded p-2 w-full">
                <option value="">Select Warehouse</option>
                {receiverWarehouses.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>
              <input {...register("receiverAddress", { required: true })} placeholder="Address" className="border rounded p-2 w-full" />
              <input {...register("receiverContact", { required: true })} placeholder="Receiver Contact No" className="border rounded p-2 w-full" />
              <select {...register("receiverRegion", { required: true })} className="border rounded p-2 w-full md:col-span-2">
                <option value="">Select your region</option>
                {uniqueRegions.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
              <textarea {...register("deliveryInstruction", { required: true })} placeholder="Delivery Instruction" className="border rounded p-2 w-full md:col-span-2" />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">* PickUp Time 4pm-7pm Approx.</p>

        <button type="submit" className="bg-lime-400 hover:bg-lime-500 text-white font-semibold rounded p-2 px-4">
          Proceed to Confirm Booking
        </button>
      </form>
    </section>
  );
};

export default SendParcel;
