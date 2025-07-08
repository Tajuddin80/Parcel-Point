import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ─── Small Leaflet marker (20 × 32) ────────────────────────────────────────────
const smallIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -28],
  shadowSize: [41, 41],
});

// ─── Component that flies / zooms the map ─────────────────────────────────────
const MapFlyTo = ({ lat, lng, zoom = 11 }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  }, [lat, lng, zoom, map]);

  return null;
};

// ─── Main map component ────────────────────────────────────────────────────────
const BangladeshMap = ({ warehouseData, searchFocusDistrict }) => (
  <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg">
    <MapContainer
      center={[23.685, 90.3563]} // Bangladesh centroid
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {searchFocusDistrict && (
        <MapFlyTo
          lat={searchFocusDistrict.latitude}
          lng={searchFocusDistrict.longitude}
          zoom={11}
        />
      )}

      {warehouseData.map((loc, i) => (
        <Marker
          key={i}
          position={[loc.latitude, loc.longitude]}
          icon={smallIcon}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <h2 className="font-bold">{loc.district}</h2>
              <p>
                <strong>City:</strong> {loc.city}
              </p>
              <p>
                <strong>Status:</strong> {loc.status}
              </p>
              <p>
                <strong>Covered:</strong> {loc.covered_area.join(", ")}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

export default BangladeshMap;
