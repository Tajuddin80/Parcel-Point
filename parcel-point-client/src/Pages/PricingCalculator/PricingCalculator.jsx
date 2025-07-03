import React, { useState, useEffect } from "react";
import warehouseData from "../../assets/warehouses.json";

const PricingCalculator = () => {
  const [parcelType, setParcelType] = useState("");
  const [weight, setWeight] = useState("");
  const [cost, setCost] = useState(null);
  const [details, setDetails] = useState("");

  const [senderRegion, setSenderRegion] = useState("");
  const [receiverRegion, setReceiverRegion] = useState("");
  const [senderWarehouse, setSenderWarehouse] = useState("");
  const [receiverWarehouse, setReceiverWarehouse] = useState("");

  const [regions, setRegions] = useState([]);
  const [senderWarehouses, setSenderWarehouses] = useState([]);
  const [receiverWarehouses, setReceiverWarehouses] = useState([]);

  useEffect(() => {
    const uniqueRegions = Array.from(new Set(warehouseData.map(w => w.region)));
    setRegions(uniqueRegions);
  }, []);

  useEffect(() => {
    if (senderRegion) {
      const warehouses = Array.from(new Set(
        warehouseData.filter(w => w.region === senderRegion).map(w => w.district)
      ));
      setSenderWarehouses(warehouses);
      setSenderWarehouse("");
    }
  }, [senderRegion]);

  useEffect(() => {
    if (receiverRegion) {
      const warehouses = Array.from(new Set(
        warehouseData.filter(w => w.region === receiverRegion).map(w => w.district)
      ));
      setReceiverWarehouses(warehouses);
      setReceiverWarehouse("");
    }
  }, [receiverRegion]);

  const calculateCost = () => {
    if (!parcelType || !senderRegion || !receiverRegion || !senderWarehouse || !receiverWarehouse) {
      setCost(null);
      setDetails("");
      return;
    }

    const isSameRegion = senderRegion === receiverRegion;
    let finalCost = 0;
    let breakdown = "";
    let weightKg = parseFloat(weight) || 0;

    if (parcelType === "Document") {
      finalCost = isSameRegion ? 60 : 80;
      breakdown = `📄 <strong>Document</strong><br>
      Base Price: ${isSameRegion ? "Within Region ৳60" : "Outside Region ৳80"}`;
    } else {
      if (weightKg <= 0) {
        setCost(null);
        setDetails("");
        return;
      }
      if (weightKg <= 3) {
        finalCost = isSameRegion ? 110 : 150;
        breakdown = `📦 <strong>Non-Document</strong><br>
        Weight: ${weightKg}kg<br>
        Base Price (up to 3kg): ${isSameRegion ? "Within Region ৳110" : "Outside Region ৳150"}`;
      } else {
        const extraKg = weightKg - 3;
        if (isSameRegion) {
          finalCost = 110 + extraKg * 40;
          breakdown = `📦 <strong>Non-Document</strong><br>
          Weight: ${weightKg}kg<br>
          Base Price (3kg): ৳110<br>
          Extra Weight (${extraKg}kg × ৳40): ৳${extraKg * 40}`;
        } else {
          finalCost = 150 + extraKg * 40 + 40;
          breakdown = `📦 <strong>Non-Document</strong><br>
          Weight: ${weightKg}kg<br>
          Base Price (3kg): ৳150<br>
          Extra Weight (${extraKg}kg × ৳40): ৳${extraKg * 40}<br>
          Outside Region Extra: ৳40`;
        }
      }
    }

    setCost(finalCost);
    setDetails(breakdown);
  };

  const resetForm = () => {
    setParcelType("");
    setSenderRegion("");
    setReceiverRegion("");
    setSenderWarehouse("");
    setReceiverWarehouse("");
    setWeight("");
    setCost(null);
    setDetails("");
  };

  return (
    <section className="w-[95vw] mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Pricing Calculator</h1>
      <p className="text-lg text-gray-500 mb-6">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
      </p>
      <div className="border-b mb-6"></div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

        {/* Pricing block - goes on top in mobile */}
        <div className="order-1 md:order-2 flex flex-col justify-center items-center text-center h-full">

          <div className="text-8xl font-extrabold text-black mb-4">
            {cost !== null ? `${cost} Tk` : "—"}
          </div>
          {cost !== null && (
            <div
              className="mt-4 text-gray-700 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: details }}
            ></div>
          )}
        </div>

        {/* Form block */}
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-semibold mb-4">Calculate Your Cost</h2>

          <div className="mb-4">
            <label className="block mb-1 text-lg">Parcel Type</label>
            <select
              value={parcelType}
              onChange={e => setParcelType(e.target.value)}
              className="border rounded p-3 w-full text-lg"
            >
              <option value="">Select Parcel Type</option>
              <option value="Document">Document</option>
              <option value="Non-Document">Non-Document</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-lg">Sender Region</label>
            <select
              value={senderRegion}
              onChange={e => setSenderRegion(e.target.value)}
              className="border rounded p-3 w-full text-lg"
            >
              <option value="">Select Sender Region</option>
              {regions.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-lg">Sender Warehouse</label>
            <select
              value={senderWarehouse}
              onChange={e => setSenderWarehouse(e.target.value)}
              className="border rounded p-3 w-full text-lg"
              disabled={!senderRegion}
            >
              <option value="">Select Sender Warehouse</option>
              {senderWarehouses.map((w, idx) => (
                <option key={idx} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-lg">Receiver Region</label>
            <select
              value={receiverRegion}
              onChange={e => setReceiverRegion(e.target.value)}
              className="border rounded p-3 w-full text-lg"
            >
              <option value="">Select Receiver Region</option>
              {regions.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-lg">Receiver Warehouse</label>
            <select
              value={receiverWarehouse}
              onChange={e => setReceiverWarehouse(e.target.value)}
              className="border rounded p-3 w-full text-lg"
              disabled={!receiverRegion}
            >
              <option value="">Select Receiver Warehouse</option>
              {receiverWarehouses.map((w, idx) => (
                <option key={idx} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {parcelType === "Non-Document" && (
            <div className="mb-4">
              <label className="block mb-1 text-lg">Weight (KG)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="Enter weight in KG"
                className="border rounded p-3 w-full text-lg"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={resetForm}
              className="bg-white border border-lime-400 text-lime-600 rounded px-5 py-2 text-lg hover:bg-lime-50"
            >
              Reset
            </button>
            <button
              onClick={calculateCost}
              className="bg-lime-400 hover:bg-lime-500 text-white font-semibold rounded px-5 py-2 text-lg"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;
