import React, { useState, useEffect } from "react";
import warehouseData from "../../assets/warehouses.json";
import Swal from "sweetalert2";

const PricingCalculator = () => {
  const [parcelType, setParcelType] = useState("");
  const [weight, setWeight] = useState("");
  const [cost, setCost] = useState(null);
  const [details, setDetails] = useState("");

  const [senderRegion, setSenderRegion] = useState("");
  const [senderDistrict, setSenderDistrict] = useState("");
  const [senderWarehouse, setSenderWarehouse] = useState("");
  const [receiverRegion, setReceiverRegion] = useState("");
  const [receiverDistrict, setReceiverDistrict] = useState("");
  const [receiverWarehouse, setReceiverWarehouse] = useState("");

  const [regions, setRegions] = useState([]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [senderWarehouses, setSenderWarehouses] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);
  const [receiverWarehouses, setReceiverWarehouses] = useState([]);

  useEffect(() => {
    const uniqueRegions = Array.from(
      new Set(warehouseData.map((w) => w.region))
    );
    setRegions(uniqueRegions);
  }, []);

  useEffect(() => {
    if (senderRegion) {
      const filtered = warehouseData.filter((w) => w.region === senderRegion);
      setSenderDistricts([...new Set(filtered.map((w) => w.district))]);
      setSenderDistrict("");
      setSenderWarehouse("");
      setSenderWarehouses([]);
    }
  }, [senderRegion]);

  useEffect(() => {
    if (senderRegion && senderDistrict) {
      const entry = warehouseData.find(
        (w) => w.region === senderRegion && w.district === senderDistrict
      );
      setSenderWarehouses(entry?.covered_area || []);
      setSenderWarehouse("");
    }
  }, [senderRegion, senderDistrict]);

  useEffect(() => {
    if (receiverRegion) {
      const filtered = warehouseData.filter((w) => w.region === receiverRegion);
      setReceiverDistricts([...new Set(filtered.map((w) => w.district))]);
      setReceiverDistrict("");
      setReceiverWarehouse("");
      setReceiverWarehouses([]);
    }
  }, [receiverRegion]);

  useEffect(() => {
    if (receiverRegion && receiverDistrict) {
      const entry = warehouseData.find(
        (w) => w.region === receiverRegion && w.district === receiverDistrict
      );
      setReceiverWarehouses(entry?.covered_area || []);
      setReceiverWarehouse("");
    }
  }, [receiverRegion, receiverDistrict]);

  const calculateCost = () => {
    if (
      !parcelType ||
      !senderRegion ||
      !receiverRegion ||
      !senderDistrict ||
      !receiverDistrict ||
      !senderWarehouse ||
      !receiverWarehouse
    ) {
      setCost(null);
      setDetails("");
      return;
    }

    if (
      senderRegion === receiverRegion &&
      senderDistrict === receiverDistrict &&
      senderWarehouse === receiverWarehouse
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Address",
        text: "Sender and receiver address cannot be exactly the same.",
        timer: 2000,
        showConfirmButton: false,
      });
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
        Base Price (up to 3kg): ${
          isSameRegion ? "Within Region ৳110" : "Outside Region ৳150"
        }`;
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
    setSenderDistrict("");
    setReceiverRegion("");
    setReceiverDistrict("");
    setSenderWarehouse("");
    setReceiverWarehouse("");
    setWeight("");
    setCost(null);
    setDetails("");
  };

  return (
    <section className="w-[95vw] mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
        Pricing Calculator
      </h1>
      <p className="text-lg text-gray-500 mb-6">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>
      <div className="border-b mb-6"></div>

      <div className="text-center mb-6">
        <div className="md:text-9xl text-7xl font-extrabold text-black">
          {cost !== null ? `${cost} Tk` : "—"}
        </div>
        {cost !== null && (
          <div
            className="mt-4 text-gray-700 text-lg"
            dangerouslySetInnerHTML={{ __html: details }}
          ></div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sender Block */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sender Information</h2>
          <div className="space-y-4">
            <select
              value={senderRegion}
              onChange={(e) => setSenderRegion(e.target.value)}
              className="w-full p-3 border rounded text-lg"
            >
              <option value="">Select Sender Region</option>
              {regions.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={senderDistrict}
              onChange={(e) => setSenderDistrict(e.target.value)}
              className="w-full p-3 border rounded text-lg"
            >
              <option value="">Select Sender District</option>
              {senderDistricts.map((d, idx) => (
                <option key={idx} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={senderWarehouse}
              onChange={(e) => setSenderWarehouse(e.target.value)}
              className="w-full p-3 border rounded text-lg"
            >
              <option value="">Select Sender Warehouse</option>
              {senderWarehouses.map((w, idx) => (
                <option key={idx} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Receiver Block */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Receiver Information</h2>
          <div className="space-y-4">
            <select
              value={receiverRegion}
              onChange={(e) => setReceiverRegion(e.target.value)}
              className="w-full p-3 border rounded text-lg"
            >
              <option value="">Select Receiver Region</option>
              {regions.map((r, idx) => (
                <option key={idx} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={receiverDistrict}
              onChange={(e) => setReceiverDistrict(e.target.value)}
              className="w-full p-3 border rounded text-lg"
            >
              <option value="">Select Receiver District</option>
              {receiverDistricts.map((d, idx) => (
                <option key={idx} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={receiverWarehouse}
              onChange={(e) => setReceiverWarehouse(e.target.value)}
              className="w-full p-3 border rounded text-lg"
            >
              <option value="">Select Receiver Warehouse</option>
              {receiverWarehouses.map((w, idx) => (
                <option key={idx} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Parcel Type</label>
          <select
            value={parcelType}
            onChange={(e) => setParcelType(e.target.value)}
            className="w-full p-3 border rounded text-lg"
          >
            <option value="">Select Parcel Type</option>
            <option value="Document">Document</option>
            <option value="Non-Document">Non-Document</option>
          </select>
        </div>

        {parcelType === "Non-Document" && (
          <div>
            <label className="block mb-1 font-semibold">Weight (KG)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-3 border rounded text-lg"
              placeholder="Enter weight"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={resetForm}
            className="border border-lime-500 text-lime-600 px-6 py-3 rounded hover:bg-lime-50 text-lg font-medium"
          >
            Reset
          </button>
          <button
            onClick={calculateCost}
            className="bg-lime-500 text-white px-6 py-3 rounded hover:bg-lime-600 text-lg font-medium"
          >
            Calculate
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;
