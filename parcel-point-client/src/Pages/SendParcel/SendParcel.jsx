import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import warehouseData from "../../assets/warehouses.json";

const SendParcel = () => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
  const parcelType = watch("parcelType", "Document");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");
  
  const [senderWarehouses, setSenderWarehouses] = useState([]);
  const [receiverWarehouses, setReceiverWarehouses] = useState([]);
  
  // Extract unique regions
  const uniqueRegions = Array.from(
    new Set(warehouseData.map(w => w.region))
  );

  // Map region -> unique districts
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
      setValue("senderWarehouse", ""); // Reset on region change
    }
  }, [senderRegion, setValue]);

  useEffect(() => {
    if (receiverRegion) {
      setReceiverWarehouses(getDistrictsByRegion(receiverRegion));
      setValue("receiverWarehouse", "");
    }
  }, [receiverRegion, setValue]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Form submitted successfully!");
    reset();
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
              type="text"
              placeholder="Parcel Weight (KG)"
              className="border rounded p-2 w-full"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Sender Details */}
          <div>
            <h3 className="font-semibold mb-2">Sender Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("senderName", { required: true })}
                type="text"
                placeholder="Sender Name"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("senderWarehouse", { required: true })}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Ware house</option>
                {senderWarehouses.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>
              <input
                {...register("senderAddress", { required: true })}
                type="text"
                placeholder="Address"
                className="border rounded p-2 w-full"
              />
              <input
                {...register("senderContact", { required: true })}
                type="text"
                placeholder="Sender Contact No"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("senderRegion", { required: true })}
                className="border rounded p-2 w-full md:col-span-2"
              >
                <option value="">Select your region</option>
                {uniqueRegions.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
              <textarea
                {...register("pickupInstruction", { required: true })}
                placeholder="Pickup Instruction"
                className="border rounded p-2 w-full md:col-span-2"
              />
            </div>
          </div>

          {/* Receiver Details */}
          <div>
            <h3 className="font-semibold mb-2">Receiver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register("receiverName", { required: true })}
                type="text"
                placeholder="Receiver Name"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("receiverWarehouse", { required: true })}
                className="border rounded p-2 w-full"
              >
                <option value="">Select Ware house</option>
                {receiverWarehouses.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>
              <input
                {...register("receiverAddress", { required: true })}
                type="text"
                placeholder="Address"
                className="border rounded p-2 w-full"
              />
              <input
                {...register("receiverContact", { required: true })}
                type="text"
                placeholder="Receiver Contact No"
                className="border rounded p-2 w-full"
              />
              <select
                {...register("receiverRegion", { required: true })}
                className="border rounded p-2 w-full md:col-span-2"
              >
                <option value="">Select your region</option>
                {uniqueRegions.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
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

        <p className="text-sm text-gray-500 mb-4">* PickUp Time 4pm-7pm Approx.</p>

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
