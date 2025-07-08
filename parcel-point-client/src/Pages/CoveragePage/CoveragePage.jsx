import React, { useState, useEffect } from "react";
import BangladeshMap from "./BangladeshMap";

const CoveragePage = () => {
  const [query, setQuery] = useState("");
  const [focusDistrict, setFocusDistrict] = useState(null);
  const [warehouseData, setWarehouseData] = useState([]);

  // ─── Load warehouse coordinates once ──────────────────────────────────────────
  useEffect(() => {
    fetch("/warehouses.json") // file lives in /public
      .then((res) => res.json())
      .then(setWarehouseData)
      .catch((err) => console.error("Failed to load warehouses:", err));
  }, []);

  // ─── Search handler ──────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    const text = e.target.value;
    setQuery(text);

    // find *first* district that contains the typed text
    const found = warehouseData.find((item) =>
      item.district.toLowerCase().includes(text.toLowerCase())
    );

    setFocusDistrict(found || null);
  };

  // ─── UI ───────────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 my-10">
      <h1 className="text-[#03373D] text-2xl md:text-4xl font-bold mb-6">
        We are available in 64 districts
      </h1>

      <div className="flex justify-start mb-6">
        <input
          type="text"
          placeholder="Search district…"
          className="input input-bordered text-xl text-[#03373D] rounded-full md:w-1/3 w-2/3"
          value={query}
          onChange={handleSearch}
        />
      </div>

      {warehouseData.length === 0 ? (
        <p className="text-center text-[#03373D]">Loading map…</p>
      ) : (
        <BangladeshMap
          warehouseData={warehouseData}
          searchFocusDistrict={focusDistrict}
        />
      )}
    </div>
  );
};

export default CoveragePage;
