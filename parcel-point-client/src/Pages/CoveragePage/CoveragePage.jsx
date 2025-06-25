// /components/CoveragePage.jsx
import React, { useState } from "react";
import BangladeshMap from "./BangladeshMap";
import warehouseData from "../../assets/warehouses.json";

const CoveragePage = () => {
  const [query, setQuery] = useState("");
  const [focusDistrict, setFocusDistrict] = useState(null);

  const handleSearch = (e) => {
    const text = e.target.value;
    setQuery(text);
    const found = warehouseData.find((item) =>
      item.district.toLowerCase().includes(text.toLowerCase())
    );
    setFocusDistrict(found || null);
  };

  return (
    <div className="p-4 my-10">
      <h1 className="text-[#03373D] text-2xl md:text-4xl font-bold mb-6">
        We are available in 64 districts
      </h1>

      <div className="flex justify-start mb-6">
        <input
          type="text"
          placeholder="Search district..."
          className="input input-bordered text-xl text-[#03373D] rounded-full md:w-1/3 w-2/3"
          value={query}
          onChange={handleSearch}
        />
      </div>

      <BangladeshMap searchFocusDistrict={focusDistrict} />
    </div>
  );
};

export default CoveragePage;